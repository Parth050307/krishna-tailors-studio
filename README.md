# Krishna Tailors Studio

Build a complete production-ready full-stack website for KRISHNA TAILOR'S, a premium women's tailoring and custom clothing business in India.

Brand: KRISHNA TAILOR'S
Tagline: “Tailored to Perfection. Designed for You.”

Design

Create a luxury Indian couture aesthetic: ivory/cream background, deep burgundy/wine, subtle gold accents, dark charcoal text, elegant serif headings, modern sans-serif body text, premium fashion imagery, subtle Indian textile-inspired details, smooth animations, and excellent responsive design for mobile/tablet/desktop. Avoid a generic/local tailor look.

Customer Website

Create:
Home, About, Services, Service Details, Wedding & Bridal, Gallery, How It Works, Measurement Guide, Custom Order, Book Measurement, Pricing, Contact, Login/Register, Privacy, Terms, Refund/Cancellation.

Homepage should include:
Hero, services, why choose us, bridal/wedding section, how it works, measurements, gallery, reviews, FAQ and strong CTAs.

Services must include:
Blouse/Saree/Bridal/Lehenga Blouse, Suit, Salwar Suit, Anarkali, Kurti, Sharara, Palazzo, Gown, Designer Gown, Western Dress, Party Wear, Wedding Wear, Bridal Wear, Bridesmaid Dress, Reception, Engagement, Haldi, Mehendi, Sangeet, Custom Designer Outfit, Alterations, Embroidery and Customization.

Custom Order Flow

Build a real end-to-end workflow:
Garment → Occasion → Design → Fabric → Customization → Reference Upload → Measurements → Delivery/Pickup → Review → Mock Payment → Confirmation → Order Tracking.

Support:

Customer-provided or tailor-provided fabric

Neck, sleeve and back customization

Padding, lining, hooks, zipper, lace, border, embroidery, sequins, buttons, tassels

Custom notes

Multiple JPG/PNG/WEBP/PDF reference uploads

INR pricing, taxes, discounts and delivery charges

Measurements

Measurements are a core feature. Build a dynamic garment-specific measurement system, not one generic form.

Support:

Inches/cm

Guided measurement instructions

Validation

Save/edit/delete/duplicate profiles

Default measurement profile

Measurement history

Profiles such as Regular, Wedding and Blouse

Examples:
Blouse: Bust, Under Bust, Waist, Shoulder, Armhole, Bicep, Sleeve Length, Wrist, Front/Back Neck Depth, Blouse Length.
Suit/Kurti: Bust, Waist, Hip, Shoulder, Armhole, Sleeve, Bicep, Wrist, Kurti Length, Neck Depth, Trouser/Palazzo Length.
Gown/Dress: Bust, Under Bust, Waist, Hip, Shoulder, Armhole, Sleeve, Bicep, Wrist, Dress Length, Neck Depth, Waist-to-Floor.
Lehenga: Waist, Hip, Lehenga Length, Waist-to-Floor plus blouse measurements.

Allow:
“I know my measurements”, “Help me measure myself”, or “Book Professional Measurement”.

Measurement Appointments

Allow customers to book professional measurement at home or store.
Include date/time slots, address, city, pincode, landmark, notes and appointment status.
Prevent double booking.

Customer Dashboard

Create:
Profile, Orders, Order Details/Tracking, Measurements, Appointments, Addresses, Saved Designs, Notifications and Settings.

Orders

Generate order numbers like KT-2026-00001.

Status workflow:
Order Placed → Measurement Confirmed → Design Confirmed → Fabric Confirmed → Cutting → Stitching → Finishing → Quality Check → Ready → Out for Delivery → Delivered.

Show a visual timeline to customers.

Payments

Use mock/test payment only for now. Build payment abstraction ready for future Razorpay integration.
Support payment states such as Pending, Paid, Failed and Refunded.
Never store card details.

Admin Dashboard

Create a protected admin dashboard to manage:
Customers, Orders, Measurements, Appointments, Services, Pricing, Fabrics, Gallery, Reviews, Staff, Notifications, FAQs and Website Settings.

Dashboard should show:
Orders, revenue, pending payments, appointments, customers, stitching/ready orders and useful charts.

Admin can:
Update orders/statuses, assign staff, manage prices/services, manage appointments, add discounts/charges, view customer measurements, manage gallery/reviews and generate invoices.

Staff Roles

Support role-based access:
SUPER_ADMIN, ADMIN, MANAGER, MEASUREMENT_STAFF, TAILOR, QUALITY_CHECK, DELIVERY_STAFF.

Tailors should see only assigned orders and the measurements/design/instructions required for them.

Notifications

Create in-app notification architecture for:
registration, order placed, payment, appointment updates, order-status changes, ready, delivery and review requests.

Keep WhatsApp and email in mock mode, but create provider-ready architecture with configurable templates/settings.

Security

Use secure authentication, password hashing, protected routes, backend authorization, role-based permissions, input validation, upload validation, private customer data, secure environment variables and proper access control.

Customer A must never access Customer B's measurements, orders, addresses or uploads.

Database

Use a proper backend/database architecture for users, customers, staff, services, garments, measurement fields/profiles, fabrics, orders, order items, customizations, uploads, appointments, payments, invoices, notifications, reviews, gallery, discounts and settings.

Important

This must be a real functional application, not only a landing page or visual prototype. Core customer, measurement, appointment, order, admin and staff workflows must actually work.

Seed realistic demo data for testing.

Use configurable storage abstraction for uploaded images/files so storage can later be migrated to cloud/S3.

Build the application cleanly, responsively and modularly so future integrations such as Razorpay, WhatsApp Business and email can be added without major rewrites. 

## Development ##

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
