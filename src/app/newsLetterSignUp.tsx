import { Button } from "@/components/ui/button";

const NewsletterSignup = () => {
  return (
    <section className=" py-7">
       <div className="bg-[#183354] text-white p-6 rounded-lg text-center">
        <h3 className="font-bold mb-2">Daily Newsletter</h3>
        <p className="text-sm text-white/80 mb-3">Get the latest insights news from our team directly to your inbox</p>
        <input
          type="email"
          placeholder="Enter your email"
          style={{
            width: '100%',
            maxWidth: '230px',
            height: '50px',
            transform: 'rotate(0deg)',
            opacity: 1,
            borderRadius: '5px',
            background: '#FFFFFF',
            marginBottom: '5px',
            margin: '0 auto 5px auto',
            padding: '0 10px',
            border: '1px solid #ccc'
          }}
        />
        <Button
          style={{
            background: '#F4796C',
            width: '100%',
            maxWidth: '230px',
            height: '50px',
            transform: 'rotate(0deg)',
            opacity: 1,
            borderRadius: '4px',
            margin: '0 auto'
          }}
        >
          Subscribe
        </Button>
        <div className="mt-3" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <input type="checkbox" id="terms" style={{ marginRight: '8px' }} />
          <label htmlFor="terms" style={{ cursor: 'pointer' }}>I agree to the terms & conditions</label>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;