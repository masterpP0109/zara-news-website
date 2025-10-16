//+------------------------------------------------------------------+
//| ARF_MB_EA_Universal_Notifications.mq5                            |
//| Works with Forex, Gold, Boom/Crash, Step Indices, Jumps, Volatilities |
//| Multi-volatility, multi-timeframe, SuperTrend + EMA + ADX + Donchian |
//| Push notifications to MT5 mobile (via MT5 desktop settings)      |
//+------------------------------------------------------------------+
#property copyright "User/AI Collaboration"
#property version   "2.8"
#property strict

#include <Trade\Trade.mqh>
CTrade trade;

// -------------------- USER INPUTS ----------------------------------
input string SymbolListCSV =
   "EURUSD,GBPUSD,USDJPY,XAUUSD," // Forex + Gold
   // Step Indices
   "Step Index,Step Index 2,"
   // Jump Indices
   "Jump 10 Index,Jump 25 Index,Jump 50 Index,Jump 75 Index,Jump 100 Index,"
   // Volatility Indices (standard)
   "Volatility 10 Index,Volatility 25 Index,Volatility 50 Index,Volatility 75 Index,Volatility 100 Index,"
   "Volatility 150 Index,Volatility 250 Index,"
   // Volatility Indices (1s)
   "Volatility 10 (1s) Index,Volatility 25 (1s) Index,Volatility 50 (1s) Index,Volatility 75 (1s) Index,Volatility 100 (1s) Index,"
   // Boom/Crash Indices
   "Boom 300 Index,Boom 500 Index,Boom 1000 Index,"
   "Crash 300 Index,Crash 500 Index,Crash 1000 Index,"
   // Range Break Indices
   "Range Break 100 Index,Range Break 200 Index";

input int    SuperTrend_ATRPeriod    = 10;
input double SuperTrend_Mult         = 2.0;
input int    EMA50_Period            = 50;
input int    ADX_Period              = 14;
input int    Donchian_Period         = 20;
input double Risk_Percent            = 1.0;  // % of equity per trade
input double Stop_ATR_Multiplier     = 2.0;
input double Take_ATR_Multiplier     = 3.0;
input bool   EnablePushNotifications = true;
input bool   EnableChartArrows       = true;
input bool   DebugMode               = true; // If true, signals will be logged but no trades executed

// Volatility multipliers (for 5 levels)
input double Volatility1             = 1.0;
input double Volatility2             = 1.5;
input double Volatility3             = 2.0;
input double Volatility4             = 2.5;
input double Volatility5             = 3.0;

// -------------------- INTERNALS ------------------------------------
string SymbolsArray[];
double LotSizeForSymbol[];
datetime lastSignalTime[]; // [symbolIndex * tfCount + tfIndex]

// -------------------- TIMEFRAMES ----------------------------------
ENUM_TIMEFRAMES Timeframes[] = { PERIOD_H4, PERIOD_H1, PERIOD_M15, PERIOD_M5, PERIOD_M1 };

// -------------------- UTILS ----------------------------------------
void LogMessage(const string &msg)
{
    Print(TimeToString(TimeCurrent(), TIME_DATE|TIME_SECONDS) + " → " + msg);
}

// Indicator helpers
double ADXValue(const string sym, ENUM_TIMEFRAMES tf, int period)
{
    int handle = iADX(sym, tf, period);
    if(handle==INVALID_HANDLE) return 0.0;
    double buffer[];
    if(CopyBuffer(handle, 2, 0, 1, buffer) <= 0) { IndicatorRelease(handle); return 0.0; }
    IndicatorRelease(handle);
    return buffer[0];
}

double ATRValue(const string sym, ENUM_TIMEFRAMES tf, int period)
{
    int handle = iATR(sym, tf, period);
    if(handle==INVALID_HANDLE) return 0.0;
    double buffer[];
    if(CopyBuffer(handle, 0, 0, 1, buffer) <= 0) { IndicatorRelease(handle); return 0.0; }
    IndicatorRelease(handle);
    return buffer[0];
}

double EMAValue(const string sym, ENUM_TIMEFRAMES tf, int period)
{
    int handle = iMA(sym, tf, period, 0, MODE_EMA, PRICE_CLOSE);
    if(handle==INVALID_HANDLE) return 0.0;
    double buffer[];
    if(CopyBuffer(handle, 0, 0, 1, buffer) <= 0) { IndicatorRelease(handle); return 0.0; }
    IndicatorRelease(handle);
    return buffer[0];
}

double CalculateLotSize(const string sym, double riskPercent, double atr, double volMultiplier)
{
    double equity = AccountInfoDouble(ACCOUNT_EQUITY);
    double riskAmount = equity * riskPercent/100.0;
    double tickValue = SymbolInfoDouble(sym, SYMBOL_TRADE_TICK_VALUE);
    double point = SymbolInfoDouble(sym, SYMBOL_POINT);
    double minLot = SymbolInfoDouble(sym, SYMBOL_VOLUME_MIN);
    double lotStep = SymbolInfoDouble(sym, SYMBOL_VOLUME_STEP);

    if(tickValue <= 0) tickValue = 0.1;
    if(point <= 0) point = 0.0001;
    if(minLot <= 0) minLot = 0.01;
    if(lotStep <= 0) lotStep = 0.01;

    double slPips = atr * Stop_ATR_Multiplier * volMultiplier / point;
    double lot = riskAmount / (slPips * tickValue);
    lot = MathMax(lot, minLot);
    lot = MathFloor(lot/lotStep)*lotStep;
    return lot;
}

// -------------------- SUPER TREND ----------------------------------
bool ComputeSuperTrend(const string sym, ENUM_TIMEFRAMES tf, int atrPeriod, double factor, int shift, double &outST, bool &isBull)
{
    if(iBars(sym, tf) <= atrPeriod + shift + 1) return false;
    double atr = ATRValue(sym, tf, atrPeriod);
    double hl2 = (iHigh(sym, tf, shift) + iLow(sym, tf, shift))/2.0;
    double finalUpper = hl2 + factor*atr;
    double finalLower = hl2 - factor*atr;
    double close = iClose(sym, tf, shift);
    isBull = (close > finalLower);
    outST = isBull ? finalLower : finalUpper;
    return true;
}

// -------------------- DONCHIAN -------------------------------------
bool DonchianHL(const string sym, ENUM_TIMEFRAMES tf, int period, int shift, double &high, double &low)
{
    if(iBars(sym, tf) < period + shift + 1) return false;
    high = -DBL_MAX; low = DBL_MAX;
    for(int i=shift; i<shift+period; i++)
    {
        double h=iHigh(sym, tf, i);
        double l=iLow(sym, tf, i);
        if(h>high) high=h;
        if(l<low)  low=l;
    }
    return true;
}

// -------------------- PLOT ARROWS ---------------------------------
void PlotSignalArrow(const string sym, datetime time, double price, bool isBuy)
{
    string name = sym + "_" + IntegerToString((int)time);
    if(ObjectFind(0, name) < 0)
    {
        ObjectCreate(0, name, OBJ_ARROW, 0, time, price);
        ObjectSetInteger(0, name, OBJPROP_ARROWCODE, isBuy ? 233 : 234);
        ObjectSetInteger(0, name, OBJPROP_COLOR, isBuy ? clrLime : clrRed);
        ObjectSetInteger(0, name, OBJPROP_WIDTH, 2);
    }
}

// -------------------- INITIALIZATION -------------------------------
int OnInit()
{
    int symbolCount = StringSplit(SymbolListCSV, ',', SymbolsArray);
    int tfCount = ArraySize(Timeframes);

    Print("DEBUG: Total symbols parsed from CSV: ", symbolCount);
    for(int i=0; i<symbolCount; i++)
    {
        Print("DEBUG: Symbol ", i, ": '", SymbolsArray[i], "'");
    }

    // Filter out empty symbols
    string validSymbols[];
    int validCount = 0;
    for(int i=0; i<symbolCount; i++)
    {
        string sym = SymbolsArray[i];
        StringTrimLeft(sym);
        StringTrimRight(sym);
        if(sym != "") validCount++;
    }
    ArrayResize(validSymbols, validCount);
    int idx = 0;
    for(int i=0; i<symbolCount; i++)
    {
        string sym = SymbolsArray[i];
        StringTrimLeft(sym);
        StringTrimRight(sym);
        if(sym != "")
        {
            validSymbols[idx] = sym;
            idx++;
        }
    }
    ArrayCopy(SymbolsArray, validSymbols);
    symbolCount = validCount;

    ArrayResize(LotSizeForSymbol, symbolCount);
    ArrayResize(lastSignalTime, symbolCount * tfCount);

    for(int i=0; i<symbolCount; i++)
    {
        LotSizeForSymbol[i] = 0;
        for(int tf=0; tf<tfCount; tf++)
            lastSignalTime[i * tfCount + tf] = 0;
        if(!SymbolSelect(SymbolsArray[i], true))
            Print("Failed to select symbol: ", SymbolsArray[i]);
    }

    Print("Symbols loaded: ", symbolCount);
    return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason)
{
    Print("EA removed, reason = ", reason);
}

// -------------------- ON TICK -------------------------------------
void OnTick()
{
    double VolatilityMultipliers[] = { Volatility1, Volatility2, Volatility3, Volatility4, Volatility5 };
    int tfCount = ArraySize(Timeframes);

    for(int s=0; s<ArraySize(SymbolsArray); s++)
    {
        string sym = SymbolsArray[s];
        if(!SymbolInfoInteger(sym, SYMBOL_SELECT)) continue;

        for(int tfIdx=0; tfIdx<tfCount; tfIdx++)
        {
            ENUM_TIMEFRAMES TradeTF = Timeframes[tfIdx];
            Print("DEBUG: Checking bars for ", sym, " on ", EnumToString(TradeTF), " - iBars: ", iBars(sym, TradeTF));
            if(iBars(sym, TradeTF) <= 10) continue;

            datetime currentBarTime = iTime(sym, TradeTF, 0);
            int idx = s * tfCount + tfIdx;
            if(currentBarTime == lastSignalTime[idx]) continue;
            lastSignalTime[idx] = currentBarTime;

            // --- Compute SuperTrend ---
            double st; bool isBull;
            if(!ComputeSuperTrend(sym, TradeTF, SuperTrend_ATRPeriod, SuperTrend_Mult, 0, st, isBull)) continue;

            // --- ADX filter ---
            double adx = ADXValue(sym, TradeTF, ADX_Period);
            if(adx < 15) continue;

            // --- EMA filter ---
            double ema50 = EMAValue(sym, TradeTF, EMA50_Period);
            if(isBull && iClose(sym,TradeTF,0) < ema50) continue;
            if(!isBull && iClose(sym,TradeTF,0) > ema50) continue;

            // --- Donchian filter ---
            double dcHigh, dcLow;
            if(!DonchianHL(sym, TradeTF, Donchian_Period, 1, dcHigh, dcLow)) continue;
            if(isBull && iClose(sym,TradeTF,0) < dcHigh) continue;
            if(!isBull && iClose(sym,TradeTF,0) > dcLow) continue;

            // --- ATR-based lot size ---
            double atr = ATRValue(sym, TradeTF, SuperTrend_ATRPeriod);

            for(int v=0; v<ArraySize(VolatilityMultipliers); v++)
            {
                double volMultiplier = VolatilityMultipliers[v];
                double lot = CalculateLotSize(sym, Risk_Percent, atr, volMultiplier);
                LotSizeForSymbol[s] = lot;

                // --- Log signals ---
                string signal = isBull ? "BUY" : "SELL";
                string msg = sym + " | TF=" + EnumToString(TradeTF) + " | " + signal +
                             " | Lot=" + DoubleToString(lot,2) + " | Vol=" + DoubleToString(volMultiplier,1);
                LogMessage(msg);
                if(EnablePushNotifications) SendNotification(msg);
                if(EnableChartArrows) PlotSignalArrow(sym, currentBarTime, iClose(sym,TradeTF,0), isBull);

                // --- Trade execution only if DebugMode = false ---
                if(!DebugMode && lot >= SymbolInfoDouble(sym, SYMBOL_VOLUME_MIN))
                {
                    double price = isBull ? SymbolInfoDouble(sym, SYMBOL_ASK) : SymbolInfoDouble(sym, SYMBOL_BID);
                    if(price <= 0) price = iClose(sym,TradeTF,0);
                    double atrStop = atr * Stop_ATR_Multiplier * volMultiplier;
                    double atrTake = atr * Take_ATR_Multiplier * volMultiplier;
                    double sl = isBull ? price - atrStop : price + atrStop;
                    double tp = isBull ? price + atrTake : price - atrTake;

                    if(isBull) trade.Buy(lot, sym, price, sl, tp);
                    else        trade.Sell(lot, sym, price, sl, tp);
                }
            }
        }
    }
}
