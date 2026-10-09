import Navbar from './Navbar';
import Footer from './Footer';
import './PrivacyPolicy.css';

const sections = [
  {
    title: 'Introduction',
    content:
      'This Privacy Policy explains how this demo storefront handles personal information in the context of a student frontend project. This website is not a real commercial backend service and does not store customer data on a production server.',
  },
  {
    title: 'Information We Collect',
    content:
      'During a normal demo checkout flow, we may temporarily collect customer information such as name, email address, phone number, billing or delivery details, and payment method selection. This information is used only in the local browser session and may be stored in localStorage for demonstration purposes.',
  },
  {
    title: 'How Information Is Used',
    content:
      'The information collected is used to simulate a shopping experience, display an order confirmation, and improve the demo flow. We do not use this information for real marketing, account creation, or external analytics in this frontend-only project.',
  },
  {
    title: 'Local Storage',
    content:
      'This project stores cart items, wishlist entries, and the most recent order in the browser localStorage. Local storage allows the demo storefront to remember user selections between page refreshes. This is not a secure server-side database and should be treated as a demo convenience only.',
  },
  {
    title: 'Cookies',
    content:
      'This project does not currently use tracking cookies or third-party advertising cookies. Any browser storage used here is limited to local demonstration behavior for cart, wishlist, and order confirmation.',
  },
  {
    title: 'Data Security',
    content:
      'Because this is a frontend demo project, there is no production backend or secure customer database. Information is not transferred to a real server and should not be treated as confidential business data.',
  },
  {
    title: 'Third-Party Services',
    content:
      'This project may use public external image URLs for product visuals and may rely on standard browser features such as localStorage. These are part of the demo experience and are not connected to a commercial data-processing system.',
  },
  {
    title: 'User Rights',
    content:
      'Users can clear browser storage, remove wishlist items, and update local cart data in the browser. If you are testing this project locally, you may delete stored data from the browser settings at any time.',
  },
  {
    title: 'Contact Information',
    content:
      'For a student assignment, contact details can be shared by the project owner or instructor. This demo storefront does not maintain a production support inbox or real customer support service.',
  },
];

function PrivacyPolicy() {
  return (
    <>
      <Navbar />

      <main className="policy-page">
        <div className="policy-container">
          <p className="eyebrow">Privacy Policy</p>
          <h1>Privacy Policy</h1>

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

export default PrivacyPolicy;
