import Navbar from './Navbar';
import Footer from './Footer';
import './Terms.css';

const sections = [
  {
    title: 'Introduction',
    content:
      'These Terms and Conditions apply to the Nike-inspired storefront demo created for a student frontend project. The website is for educational and demonstration purposes only and does not represent an official commercial Nike website.',
  },
  {
    title: 'Use of Website',
    content:
      'You agree to use this website only for lawful and educational purposes. You must not misuse the site, attempt to interfere with the functionality, or use the platform for harmful, deceptive, or unauthorized activities.',
  },
  {
    title: 'Products and Pricing',
    content:
      'All product names, descriptions, and prices are part of the demo storefront and may be used for presentation only. Pricing and availability are illustrative and may not reflect real marketplace conditions.',
  },
  {
    title: 'Orders',
    content:
      'The checkout flow simulates a purchase process for demonstration purposes. No real payment is processed, and no real order is legally binding unless a production backend and payment system are added later.',
  },
  {
    title: 'Payments',
    content:
      'This project does not integrate with a real payment provider. Payment method choices shown during checkout are demo selections only and are not connected to live financial processing.',
  },
  {
    title: 'Returns / Refunds',
    content:
      'Because this is a frontend demo, any return or refund policy is illustrative only. No real financial refunds are processed through the application.',
  },
  {
    title: 'Intellectual Property',
    content:
      'The design, code, and content in this project are used for learning and demonstration. Product names, trademarks, and brand styling are inspired by a general sportswear aesthetic and are not used as official Nike branding or official company assets.',
  },
  {
    title: 'Limitation of Liability',
    content:
      'This project is provided on an "as is" basis for educational use. The authors are not liable for loss or damage caused by using the demo storefront, including issues with browser storage, local data handling, or simulation-only checkout behavior.',
  },
  {
    title: 'Changes to Terms',
    content:
      'These terms may be updated as the project evolves. Continued use of the demo website following updates means you accept the revised terms in place at that time.',
  },
  {
    title: 'Contact',
    content:
      'For questions about this front-end assignment, contact the project owner, instructor, or repository maintainer. This demo does not offer real customer support or business services.',
  },
];

function Terms() {
  return (
    <>
      <Navbar />

      <main className="policy-page">
        <div className="policy-container">
          <p className="eyebrow">Terms & Conditions</p>
          <h1>Terms & Conditions</h1>

          {sections.map((section) => (
            <section key={section.title} className="policy-section">
              <h2>{section.title}</h2>
              <p>{section.content}</p>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Terms;
