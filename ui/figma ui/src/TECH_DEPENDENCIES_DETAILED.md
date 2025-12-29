# NUON App - Tech Dependencies (Detailed Breakdown)

## Complete Technical Infrastructure Requirements for Launch

---

# 1. INFRASTRUCTURE

## 1.1 Application Hosting

### A. Backend Server Hosting
**What You Need:**
- Server to run Node.js/Python backend API
- REST or GraphQL API endpoints
- Auto-scaling capability (handle traffic spikes)
- Load balancing (distribute requests)
- 99.9% uptime guarantee

**Recommended Options:**

#### **Option 1: DigitalOcean App Platform** ⭐ (RECOMMENDED)
- **Pros:**
  - Simple setup, perfect for startups
  - Fixed, predictable pricing
  - Auto-deployments from GitHub
  - Includes load balancing
  - Good support
- **Specs:** 
  - Basic: 1GB RAM, 1 vCPU
  - Professional: 4GB RAM, 2 vCPUs
- **Cost:** ₹800-8,000/month
- **Best For:** Quick launch, startups
- **Setup Time:** 1-2 hours

#### **Option 2: Railway**
- **Pros:**
  - Modern developer experience
  - Pay-per-use pricing
  - Easy scaling
  - Great for Node.js
- **Cost:** $5-50/month (₹400-4,000)
- **Best For:** Developer-friendly setup
- **Setup Time:** 30 minutes

#### **Option 3: AWS EC2/ECS**
- **Pros:**
  - Full control over infrastructure
  - Highly scalable
  - Enterprise-grade
- **Cons:**
  - Complex setup
  - Requires DevOps knowledge
- **Cost:** ₹3,000-20,000/month
- **Best For:** Large scale, custom needs
- **Setup Time:** 1-2 weeks

#### **Option 4: Heroku**
- **Pros:**
  - Very easy deployment
  - Auto-scaling
- **Cons:**
  - More expensive
  - Less control
- **Cost:** $7-50/month (₹600-4,000)
- **Best For:** Rapid prototyping
- **Setup Time:** 30 minutes

#### **Option 5: Vercel/Netlify (Serverless)**
- **Pros:**
  - Great for frontend + serverless backend
  - Free tier available
  - CDN included
- **Cost:** $0-20/month
- **Best For:** Serverless architecture
- **Setup Time:** 1 hour

**🎯 RECOMMENDATION:** Start with **Railway** or **DigitalOcean App Platform** for ease + cost efficiency.

---

### B. Frontend Hosting
**What You Need:**
- Host for React web app
- CDN for fast global delivery
- SSL certificate (HTTPS)
- Auto-deployment from Git

**Recommended Options:**

#### **Option 1: Vercel** ⭐ (RECOMMENDED)
- **Pros:**
  - Built for React/Next.js
  - Global CDN included
  - Auto SSL certificates
  - Preview deployments for PRs
  - Zero-config deployment
- **Free Tier:** 
  - 100GB bandwidth/month
  - Unlimited sites
- **Paid:** ₹1,500/month ($20)
- **Setup Time:** 15 minutes

#### **Option 2: Netlify**
- Similar to Vercel
- Great free tier
- **Cost:** Free → ₹1,500/month
- **Setup Time:** 15 minutes

#### **Option 3: Cloudflare Pages**
- Completely free
- Cloudflare CDN
- **Cost:** Free
- **Setup Time:** 20 minutes

**🎯 RECOMMENDATION:** **Vercel** (best DX, perfect for React)

---

## 1.2 Database

### A. Primary Database (PostgreSQL)

**What You Need:**
- Relational database for structured data
- ACID compliance (for transactions)
- Automated backups
- Point-in-time recovery
- Read replicas for scaling

**Recommended Options:**

#### **Option 1: Supabase** ⭐ (RECOMMENDED for Rapid Launch)
- **What it is:** PostgreSQL + real-time + built-in auth + storage
- **Pros:**
  - All-in-one solution
  - Built-in authentication (can use for phone OTP)
  - File storage included
  - Real-time subscriptions
  - Auto-generated REST & GraphQL APIs
  - Great free tier
- **Free Tier:**
  - 500MB database
  - 1GB file storage
  - 2GB bandwidth
  - 50,000 monthly active users
- **Paid Plans:**
  - Pro: $25/month (₹2,000) - 8GB database
  - Team: $599/month (₹50,000) - enterprise
- **Best For:** Startups, rapid development
- **Setup Time:** 30 minutes
- **🎯 PERFECT FOR NUON** - handles auth + DB + storage

#### **Option 2: AWS RDS (PostgreSQL)**
- **Pros:**
  - Enterprise-grade reliability
  - Advanced features
  - Multi-AZ deployment
  - Automated backups
- **Cons:**
  - More expensive
  - Complex setup
- **Cost:** ₹3,000-10,000/month
- **Specs:** 
  - db.t3.micro: 1GB RAM, 20GB storage
  - db.t3.small: 2GB RAM, 50GB storage
- **Best For:** Production-ready, scalable apps
- **Setup Time:** 2-3 hours

#### **Option 3: DigitalOcean Managed Database**
- **Pros:**
  - Simpler than AWS
  - Fixed pricing
  - Good performance
- **Cost:** ₹1,200-8,000/month
- **Specs:**
  - Basic: 1GB RAM, 10GB storage - ₹1,200/month
  - Professional: 4GB RAM, 80GB storage - ₹6,000/month
- **Best For:** Mid-sized apps
- **Setup Time:** 1 hour

#### **Option 4: Neon (Serverless Postgres)**
- **Pros:**
  - Serverless, auto-scaling
  - Pay-per-use
  - Free tier available
- **Cost:** Free → $19/month
- **Best For:** Variable traffic
- **Setup Time:** 20 minutes

**🎯 RECOMMENDATION:** 
- **For Launch:** Supabase (free tier → $25/month)
- **For Scale:** AWS RDS or DigitalOcean Managed

---

### B. Cache Layer (Optional but Recommended)

**What You Need:**
- In-memory cache for session data
- Faster read performance
- Reduce database load

**Recommended Options:**

#### **Option 1: Upstash Redis** ⭐ (RECOMMENDED)
- **Pros:**
  - Serverless Redis
  - Pay-per-request
  - Free tier available
- **Free Tier:** 
  - 10,000 commands/day
  - 256MB storage
- **Paid:** From $0.2/100K requests
- **Cost:** ₹0-2,000/month
- **Setup Time:** 15 minutes

#### **Option 2: AWS ElastiCache (Redis)**
- **Pros:**
  - Fully managed
  - High availability
- **Cons:**
  - More expensive
- **Cost:** ₹2,000-8,000/month
- **Setup Time:** 1 hour

#### **Option 3: Railway Redis**
- **Pros:**
  - Simple setup
  - Integrated with Railway hosting
- **Cost:** $5-20/month (₹400-1,600)
- **Setup Time:** 10 minutes

**🎯 RECOMMENDATION:** Start with **Upstash** (free tier), add later if needed.

---

## 1.3 File Storage

### A. Video Storage

**What You Need:**
- Store 200-500GB of course videos
- Cheap storage costs
- Fast download speeds
- Video streaming capability

**Recommended Options:**

#### **Option 1: Backblaze B2** ⭐ (CHEAPEST)
- **Pros:**
  - Cheapest cloud storage
  - S3-compatible API
  - First 10GB bandwidth free daily
- **Pricing:**
  - Storage: ₹0.40/GB/month
  - Bandwidth: ₹0.80/GB (after free tier)
- **For 300GB videos:**
  - Storage: ₹120/month
  - Bandwidth (100GB/month): ₹40/month
  - **Total: ~₹160/month**
- **Setup Time:** 1 hour
- **Best For:** Cost-effective video storage

#### **Option 2: AWS S3**
- **Pros:**
  - Industry standard
  - Highly reliable
  - Integration with CloudFront CDN
- **Pricing:**
  - Storage: ₹1.60/GB/month
  - Bandwidth: ₹7/GB transfer
- **For 300GB videos:**
  - Storage: ₹480/month
  - Bandwidth (100GB/month): ₹700/month
  - **Total: ~₹1,180/month**
- **Setup Time:** 2 hours
- **Best For:** Enterprise, high reliability

#### **Option 3: Google Cloud Storage**
- Similar pricing to S3
- **Cost:** ₹1.50/GB/month storage
- **Setup Time:** 2 hours

**🎯 RECOMMENDATION:** **Backblaze B2** for videos (5-7x cheaper than S3)

---

### B. Image Storage (Profile Photos, Thumbnails)

**What You Need:**
- Image upload & storage
- Automatic image compression
- Thumbnail generation
- Format conversion (WebP, AVIF)
- CDN delivery

**Recommended Options:**

#### **Option 1: Cloudinary** ⭐ (RECOMMENDED)
- **Pros:**
  - Auto-compression & optimization
  - Automatic format conversion
  - On-the-fly image transformations
  - Built-in CDN
  - Easy integration
- **Free Tier:**
  - 25GB storage
  - 25GB bandwidth/month
  - Good for 10,000 users
- **Paid Plans:**
  - $89/month (₹7,500) - 125GB storage
- **Setup Time:** 30 minutes
- **Best For:** Image-heavy apps

#### **Option 2: ImageKit**
- Similar to Cloudinary
- Slightly cheaper
- **Free Tier:** 20GB bandwidth
- **Cost:** ₹3,000-8,000/month
- **Setup Time:** 30 minutes

#### **Option 3: AWS S3 + CloudFront**
- **Pros:**
  - More control
  - Cheaper at scale
- **Cons:**
  - Manual image processing
  - No auto-optimization
- **Cost:** ₹1,000-3,000/month
- **Setup Time:** 2-3 hours

**🎯 RECOMMENDATION:** **Cloudinary** (free tier for launch, auto-optimization saves bandwidth)

---

### C. Document Storage (PDFs, Course Materials)

**Same as video storage:**
- Use **Backblaze B2** or **AWS S3**
- **Estimated need:** 10-20GB
- **Cost:** ₹4-32/month (Backblaze)

---

## 1.4 CDN (Content Delivery Network)

**What You Need:**
- Fast content delivery across India
- Reduce server load
- Improve video streaming
- Cache static assets
- DDoS protection

**Recommended Options:**

#### **Option 1: Cloudflare** ⭐ (RECOMMENDED)
- **Pros:**
  - Generous free tier
  - DDoS protection included
  - SSL certificates included
  - Analytics included
  - Indian edge servers (Mumbai, Chennai)
  - 200+ global locations
- **Free Tier:**
  - Unlimited bandwidth
  - Basic DDoS protection
  - SSL certificates
  - Analytics
- **Paid Plans:**
  - Pro: $20/month (₹1,600) - Advanced DDoS, image optimization
  - Business: $200/month (₹16,000) - Priority support
- **Cost:** **FREE** for most startups
- **Setup Time:** 30 minutes
- **Best For:** Everyone (no reason not to use)

#### **Option 2: BunnyCDN**
- **Pros:**
  - Very cheap pay-per-use
  - Good for video streaming
  - Indian PoP available
- **Pricing:**
  - ₹0.80/GB in India/Asia
  - No monthly minimum
- **For 100GB/month:** ₹80/month
- **Setup Time:** 1 hour
- **Best For:** Video-heavy apps on budget

#### **Option 3: AWS CloudFront**
- **Pros:**
  - Tight AWS integration
  - Enterprise features
- **Cons:**
  - More expensive
- **Pricing:**
  - ₹6-8/GB in India
- **For 100GB/month:** ₹600-800/month
- **Setup Time:** 2 hours
- **Best For:** AWS ecosystem users

**🎯 RECOMMENDATION:** **Cloudflare** (free tier is amazing) + **BunnyCDN** for video streaming (if needed)

---

# 2. AUTHENTICATION & SECURITY

## 2.1 Phone Authentication (OTP)

**What You Need:**
- Send OTP SMS to Indian phone numbers
- 6-digit code generation
- OTP expiry (5-10 minutes)
- Rate limiting (prevent spam)
- Resend OTP functionality
- DLT registration (mandatory in India)

**Recommended Options:**

#### **Option 1: MSG91** ⭐ (RECOMMENDED - Indian Service)
- **Pros:**
  - Indian company, great India support
  - DLT template approval help
  - Reliable delivery
  - Affordable pricing
- **Pricing:**
  - ₹0.15-0.40 per SMS (depends on volume)
  - Promotional: ₹0.15/SMS
  - Transactional: ₹0.25/SMS
- **For 20,000 OTP/month:** ₹3,000-8,000
- **Setup:**
  - Create MSG91 account
  - Register for DLT (2-3 days)
  - Create OTP template
  - Get API key
- **Setup Time:** 3-5 days (including DLT)
- **Best For:** Indian market

#### **Option 2: Firebase Authentication**
- **Pros:**
  - Complete auth solution
  - Phone + Email + Social login
  - Free for first 10K verifications/month
- **Pricing:**
  - ₹0.06 per phone verification (India)
  - Beyond free tier
- **For 20,000 verifications:** ₹1,200/month
- **Cons:**
  - Uses Twilio behind the scenes (expensive at scale)
- **Setup Time:** 2 hours
- **Best For:** Multiple auth methods needed

#### **Option 3: Twilio SMS**
- **Pros:**
  - Global leader
  - Reliable
  - Good documentation
- **Cons:**
  - Expensive for India
- **Pricing:**
  - ₹0.50-1.00 per SMS
- **For 20,000 SMS:** ₹10,000-20,000/month ❌ Too expensive
- **Setup Time:** 2 hours
- **Best For:** Global apps

#### **Option 4: AWS SNS**
- **Pricing:**
  - ₹0.50 per SMS
- **For 20,000 SMS:** ₹10,000/month
- **Setup Time:** 2 hours
- **Best For:** AWS ecosystem

#### **Option 5: Kaleyra (Indian Service)**
- Similar to MSG91
- **Pricing:** ₹0.20-0.50/SMS
- **Setup Time:** 3-5 days
- **Best For:** Alternative to MSG91

**🎯 RECOMMENDATION:** **MSG91** (best pricing for India + local support)

**DLT Registration Process:**
1. Register on DLT portal (https://www.dltconnect.com/)
2. Submit business documents (PAN, GST, Business proof)
3. Create message templates for approval
4. Get Principal Entity ID (PE-ID)
5. Get Template IDs approved
6. Use in MSG91 API
**Time:** 2-3 business days

---

## 2.2 Data Security

### A. SSL/TLS Certificates

**What You Need:**
- HTTPS encryption for all traffic
- Valid SSL certificate
- Auto-renewal

**Solutions:**

#### **Let's Encrypt** ⭐ (FREE)
- **Pros:**
  - Completely free
  - Auto-renewal with Certbot
  - Trusted by all browsers
- **Included in:**
  - Vercel (auto)
  - Netlify (auto)
  - Cloudflare (auto)
  - Railway (auto)
- **Cost:** FREE
- **Setup Time:** 10 minutes (manual) or automatic

**🎯 RECOMMENDATION:** Use hosting platform's auto-SSL (Vercel, Cloudflare)

---

### B. Data Encryption

**What You Need:**
- Encrypt data at rest (in database)
- Encrypt data in transit (HTTPS)
- Hash passwords securely
- Encrypt sensitive fields

**Implementation:**

#### **At Rest (Database):**
- PostgreSQL: Built-in encryption
- Supabase: Encrypted by default
- AWS RDS: Enable encryption option
- **Cost:** Included

#### **In Transit:**
- HTTPS/TLS 1.3 everywhere
- Use SSL for database connections
- **Cost:** Included with SSL certificates

#### **Password Hashing:**
- Use **bcrypt** (Node.js library)
- 10-12 salt rounds
- Never store plain passwords
- **Code:**
```javascript
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```
- **Cost:** FREE (library)

#### **Sensitive Data Encryption:**
- Use **AES-256** for PII
- Store encryption keys in environment variables
- Use AWS KMS or similar for key management
- **Library:** crypto (built into Node.js)

---

### C. Security Tools

#### **Firewall (Web Application Firewall)**

**Option 1: Cloudflare WAF** ⭐
- **Included in:** Cloudflare Pro ($20/month)
- **Features:**
  - OWASP top 10 protection
  - Custom firewall rules
  - Rate limiting
  - Bot protection
- **Cost:** ₹1,600/month (Pro plan)

**Option 2: AWS WAF**
- **Cost:** $5/month + rules + requests
- **More complex setup**

**🎯 RECOMMENDATION:** Cloudflare WAF

---

#### **DDoS Protection**

**Cloudflare** (FREE)
- Automatic DDoS mitigation
- Included in free tier
- Can handle large attacks
- **Cost:** FREE

---

#### **Vulnerability Scanning**

**OWASP ZAP** (FREE)
- Open-source security testing
- Find XSS, SQL injection, etc.
- **Cost:** FREE
- **Setup Time:** 2 hours to learn

**Snyk** (Dependency Scanning)
- Scans npm packages for vulnerabilities
- Free for open source
- **Cost:** FREE-$52/month
- **Setup Time:** 30 minutes

---

#### **Penetration Testing**

**Annual Security Audit:**
- Hire cybersecurity firm
- Comprehensive penetration testing
- Vulnerability assessment
- **Cost:** ₹50,000-2,00,000/year
- **Frequency:** Annually or before major launches

---

# 3. PAYMENT PROCESSING

## 3.1 Payment Gateway

**What You Need:**
- Accept credit/debit cards (Visa, Mastercard, RuPay)
- UPI payments (PhonePe, Google Pay, Paytm, BHIM)
- Net banking (100+ banks)
- Digital wallets (Paytm, PhonePe wallet, etc.)
- International cards (for future)
- Webhook for payment status
- Refund API
- Payment link generation
- Receipt/invoice generation

**Comparison of Payment Gateways:**

| Feature | Razorpay | Cashfree | PayU | Stripe |
|---------|----------|----------|------|--------|
| **Card Fee** | 2% + ₹0 | 1.95% + ₹0 | 2% + ₹0 | 2.9% + ₹2 |
| **UPI Fee** | 1% (max ₹3K) | 1% | 1% | N/A |
| **Net Banking** | 2% | 1.95% | 2% | N/A |
| **Setup Fee** | ₹0 | ₹0 | ₹0 | ₹0 |
| **Settlement** | T+3 days | T+1/T+3 | T+3 | 7 days |
| **Dashboard** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **India Focus** | ✅ Excellent | ✅ Excellent | ✅ Good | ❌ Limited |
| **Documentation** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Support** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

### **Option 1: Razorpay** ⭐ (RECOMMENDED)

**Why Razorpay:**
- ✅ #1 choice for Indian startups
- ✅ Best documentation & developer experience
- ✅ All payment methods (cards, UPI, wallets, net banking)
- ✅ EMI options (for courses >₹5,000)
- ✅ Subscriptions support (for future)
- ✅ International cards accepted
- ✅ Comprehensive dashboard
- ✅ Great webhook system
- ✅ Easy refunds
- ✅ Payment links (shareable links)
- ✅ Smart Collect (for UPI ID)

**Pricing:**
- Cards: 2% + ₹0 per transaction
- UPI: 1% (capped at ₹3,000 per transaction)
- Net Banking: 2% + ₹0
- Wallets: 2% + ₹0
- No setup fee
- No annual maintenance

**Example Cost:**
- ₹10,00,000 monthly revenue
- Avg. 60% cards, 30% UPI, 10% net banking
- Card fee: ₹12,000
- UPI fee: ₹3,000
- Net Banking: ₹2,000
- **Total: ~₹17,000/month (1.7% effective rate)**

**Settlement:**
- T+3 business days
- Can enable instant settlement (extra fee)

**KYC Requirements:**
- PAN Card
- GST Certificate (if registered)
- Bank account proof
- Business proof (registration certificate)
- Directors' KYC

**Setup Process:**
1. Sign up on razorpay.com
2. Submit KYC documents
3. Wait for approval (1-2 days)
4. Get API keys (test & live)
5. Integrate SDK
6. Test in test mode
7. Go live

**Setup Time:** 2-3 days (including KYC approval)

**Integration:**
```javascript
// Frontend - React
import Razorpay from 'razorpay';

const options = {
  key: 'rzp_test_xxxxxx', // API key
  amount: 499900, // Amount in paise (₹4,999)
  currency: 'INR',
  name: 'NUON',
  description: 'Advanced Critical Care Nursing Course',
  order_id: 'order_xxxxx', // From backend
  handler: function (response) {
    // Payment successful
    verifyPayment(response.razorpay_payment_id);
  },
  prefill: {
    name: 'User Name',
    email: 'user@email.com',
    contact: '9876543210'
  },
  theme: {
    color: '#9333EA' // NUON purple
  }
};

const rzp = new Razorpay(options);
rzp.open();
```

**Backend - Node.js:**
```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
const order = await razorpay.orders.create({
  amount: 499900, // paise
  currency: 'INR',
  receipt: 'order_rcpt_11'
});

// Verify payment (webhook)
const crypto = require('crypto');
const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET);
shasum.update(JSON.stringify(req.body));
const digest = shasum.digest('hex');

if (digest === req.headers['x-razorpay-signature']) {
  // Valid webhook
  // Update database
}
```

**Features Needed:**
- ✅ Payment links (for email/WhatsApp sharing)
- ✅ Webhooks (payment.authorized, payment.failed, refund.created)
- ✅ Refund API
- ✅ Smart Collect (for mentor payouts to collect UPI)
- ✅ Payment pages (hosted checkout)
- ✅ Subscriptions (for Phase 2)

---

### **Option 2: Cashfree**

**Pros:**
- Slightly cheaper (1.95% vs 2%)
- Faster settlement (T+1 available)
- Good for high volumes

**Cons:**
- Smaller community
- Less polished docs

**Pricing:** 1.95% (saves ₹500/month on ₹10L revenue)

**Best For:** Cost-conscious, high volume

---

### **Option 3: PayU**

**Pros:**
- Established player
- Good reliability

**Cons:**
- Older dashboard
- Average developer experience

**Pricing:** 2% + ₹0

**Best For:** Enterprise preference

---

### **Option 4: Stripe**

**Pros:**
- Best-in-class dashboard
- Superior developer experience
- Global standard

**Cons:**
- ❌ Higher fees in India (2.9% + ₹2)
- ❌ 7-day settlement
- ❌ Limited India payment methods
- ❌ UPI not supported

**Pricing:** 2.9% + ₹2 (expensive for India)

**Best For:** Global expansion, international customers

---

**🎯 RECOMMENDATION:** **Razorpay** (best balance of features, pricing, and DX for Indian market)

---

## 3.2 Subscription Management (Future Phase)

**What You Need:**
- Recurring billing (monthly/annual plans)
- Auto-charge on renewal date
- Dunning management (retry failed payments)
- Plan upgrades/downgrades
- Pro-rated billing
- Pause/cancel subscriptions

**Recommended Options:**

#### **Option 1: Razorpay Subscriptions** ⭐
- Built into Razorpay
- Same pricing (2% per charge)
- Automatic retries for failed payments
- **Cost:** Same transaction fees
- **Setup Time:** 1-2 days

#### **Option 2: Chargebee**
- Dedicated subscription billing platform
- Advanced features (metered billing, complex pricing)
- **Cost:** $249/month + transaction fees
- **Best For:** Complex billing needs
- **Setup Time:** 1 week

#### **Option 3: Stripe Billing**
- If using Stripe
- **Cost:** Transaction fees only
- **Setup Time:** 2-3 days

**🎯 RECOMMENDATION:** **Razorpay Subscriptions** (when needed in future)

---

## 3.3 Mentor Payout System

**What You Need:**
- Pay mentors after session completion
- Bank transfer or UPI
- Bulk payouts (pay 50 mentors at once)
- Payout scheduling (weekly/monthly)
- Tax compliance (TDS if needed)
- Payout tracking

**Recommended Options:**

#### **Option 1: Razorpay Route** ⭐ (RECOMMENDED)
- **What it is:** Bulk payout system
- **Features:**
  - Pay to bank accounts (NEFT/IMPS)
  - Pay to UPI IDs
  - Bulk CSV upload
  - Automatic tax compliance
  - Dashboard for tracking
- **Pricing:**
  - Bank transfer: ₹3-5 per payout + 0.25% of amount
  - UPI: ₹2-3 per payout
- **Example:**
  - 100 mentors × ₹1,500 average = ₹1,50,000
  - Fee: ₹500 + ₹375 (0.25%) = ₹875
- **Settlement:** Instant to 24 hours
- **Setup Time:** 2-3 days
- **Best For:** Integrated with Razorpay payments

#### **Option 2: Cashfree Payouts**
- Similar features
- Slightly cheaper
- **Pricing:** ₹2-4 per payout + 0.25%
- **Setup Time:** 2-3 days

**🎯 RECOMMENDATION:** **Razorpay Route** (seamless if using Razorpay for payments)

---

# 4. VIDEO INFRASTRUCTURE

## 4.1 Video Hosting

**What You Need:**
- Store course videos (200-600 videos)
- Video transcoding (multiple qualities)
- Adaptive streaming (HLS/DASH)
- Privacy controls (no public access)
- Video player embed
- Analytics (watch time, completion)
- DRM (optional, for piracy protection)

**Comparison:**

| Feature | Vimeo Pro | Self-Hosted (S3+CloudFront) | Wistia | YouTube (Private) |
|---------|-----------|------------------------------|--------|-------------------|
| **Storage** | 5TB/year | Unlimited (pay-per-GB) | 200GB | Unlimited |
| **Bandwidth** | 1TB/year | Pay-per-GB | 1TB/year | Unlimited |
| **Privacy** | ✅ Password, domain restriction | ✅ Signed URLs | ✅ Advanced | ⚠️ Unlisted only |
| **Player** | ✅ Customizable | ⚠️ Custom build | ✅ Excellent | ❌ YouTube branded |
| **Analytics** | ⭐⭐⭐⭐ | ⚠️ Custom | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Cost/month** | ₹6,000-12,000 | ₹3,000-8,000 | ₹8,500+ | FREE |
| **Setup** | ⭐⭐⭐⭐⭐ Easy | ⭐⭐ Complex | ⭐⭐⭐⭐ Easy | ⭐⭐⭐⭐⭐ Easy |
| **Best For** | Quick launch | Long-term, custom | Marketing | ❌ Not for courses |

---

### **Option 1: Vimeo Pro** ⭐ (RECOMMENDED for Launch)

**Why Vimeo:**
- ✅ Quick setup (upload & embed)
- ✅ Automatic transcoding to multiple qualities
- ✅ Privacy controls (password, domain restriction)
- ✅ Customizable player (remove Vimeo branding)
- ✅ Analytics (watch time, engagement)
- ✅ Good video quality
- ✅ Resume playback
- ✅ Captions/subtitles support
- ✅ No ads (unlike YouTube)

**Pricing:**
- **Vimeo Pro:** $20/month (~₹1,600)
  - 5TB storage/year (enough for 100-200 videos)
  - 1TB bandwidth/year
- **Vimeo Premium:** $75/month (~₹6,000)
  - Unlimited storage
  - Unlimited bandwidth
  - Advanced analytics

**Estimated Need:**
- 200 videos × 500MB avg = 100GB storage ✅ Fits in Pro
- 10,000 users × 10 hours watched × 500MB/hour = 50TB/year bandwidth
- **Need:** Premium plan (₹6,000/month)

**Privacy Settings:**
- Password-protect videos
- Domain restriction (only play on nuon.app)
- Disable download
- Disable sharing

**Embed Code:**
```html
<iframe 
  src="https://player.vimeo.com/video/123456789?h=xxxxx" 
  width="640" 
  height="360" 
  frameborder="0" 
  allow="autoplay; fullscreen; picture-in-picture" 
  allowfullscreen
></iframe>
```

**Setup Time:** 30 minutes

**Best For:** Rapid launch, hassle-free

---

### **Option 2: Self-Hosted (AWS S3 + CloudFront)** 

**Why Self-Hosted:**
- ✅ More control
- ✅ Cheaper at large scale
- ✅ Custom features
- ✅ No vendor lock-in

**Cons:**
- ⚠️ Complex setup
- ⚠️ Manual video processing
- ⚠️ Need to build player

**Architecture:**
1. Upload video to S3
2. Trigger AWS MediaConvert (transcode to 360p, 720p, 1080p)
3. Store transcoded videos in S3
4. Serve via CloudFront CDN
5. Use Video.js player on frontend

**Cost Breakdown:**
- Storage (300GB): ₹480/month (S3)
- Transcoding: ₹10-15 per hour of video (one-time)
  - 200 videos × 20 min avg × ₹10/hour = ₹700
- Bandwidth (100GB/month): ₹700/month (CloudFront)
- **Total: ~₹1,200/month + ₹700 one-time**

**Setup Time:** 2-3 weeks (complex)

**Best For:** Long-term cost savings, full control

---

### **Option 3: Wistia**

**Why Wistia:**
- ✅ Best-in-class video analytics
- ✅ Marketing-focused (CTAs, email gates)
- ✅ Great player customization
- ✅ A/B testing built-in

**Cons:**
- ❌ More expensive
- ⚠️ Focused on marketing, not education

**Pricing:**
- **Pro:** $99/month (₹8,500)
  - 200GB storage
  - 1TB bandwidth/year

**Best For:** Marketing videos, lead generation

---

### **Option 4: YouTube (Private/Unlisted)**

**Pros:**
- ✅ FREE unlimited storage & bandwidth
- ✅ Automatic transcoding
- ✅ Global CDN

**Cons:**
- ❌ No true privacy (unlisted links can be shared)
- ❌ YouTube branding on player
- ❌ Ads (unless YouTube Premium)
- ❌ Not professional for paid courses
- ❌ Can't restrict access properly

**Best For:** ❌ NOT recommended for NUON (paid course platform)

---

**🎯 RECOMMENDATION for NUON:**
- **Phase 1 (Launch):** Vimeo Premium (₹6,000-12,000/month) - Quick, hassle-free
- **Phase 2 (Scale):** Migrate to self-hosted S3 + CloudFront (₹3,000-8,000/month) - Cost savings

---

## 4.2 Video Player

**What You Need:**
- Embedded video player
- Playback controls (play, pause, seek)
- Speed control (0.5x, 1x, 1.5x, 2x)
- Quality selection (360p, 720p, 1080p)
- Fullscreen mode
- Picture-in-picture
- Subtitles/captions
- Resume from last position
- Keyboard shortcuts
- Mobile-responsive

**Options:**

#### **If using Vimeo:**
- Use Vimeo's built-in player ✅
- Fully customizable
- All features included
- **Cost:** Included

#### **If self-hosting (S3):**

**Video.js** ⭐ (FREE, Open-Source)
- Popular HTML5 player
- Plugin ecosystem
- Highly customizable
- **Setup:**
```javascript
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const player = videojs('my-video', {
  controls: true,
  autoplay: false,
  preload: 'auto',
  fluid: true, // Responsive
  playbackRates: [0.5, 1, 1.5, 2],
  controlBar: {
    children: [
      'playToggle',
      'currentTimeDisplay',
      'timeDivider',
      'durationDisplay',
      'progressControl',
      'volumePanel',
      'qualitySelector', // Plugin
      'fullscreenToggle'
    ]
  }
});
```

**Plyr** (Alternative)
- Modern, lightweight player
- Beautiful UI
- Free & open-source

---

## 4.3 Video Transcoding

**What You Need:**
- Convert uploaded videos to multiple formats/resolutions
- H.264 codec (widely supported)
- Multiple qualities for adaptive streaming

**Options:**

#### **If using Vimeo:**
- Automatic transcoding included ✅
- **Cost:** Included

#### **If self-hosting:**

**AWS MediaConvert** ⭐
- Cloud video transcoding service
- **Pricing:** ₹10-15 per hour of output video
  - Example: 20-min video transcoded to 3 qualities = 1 hour output = ₹15
- **Setup:** Create jobs via API
- **Time:** 1-2x realtime (20 min video = 20-40 min processing)

**Cloudflare Stream**
- All-in-one solution (storage + transcoding + CDN)
- **Pricing:** ₹4 per 1,000 minutes uploaded + ₹0.80 per 1,000 minutes watched
- **Best For:** Simpler alternative to AWS

**FFmpeg (Self-hosted)**
- FREE open-source tool
- Run on your server
- **Cons:** Requires powerful server, slow
- **Best For:** Budget-constrained

---

## 4.4 Video Analytics

**What You Need:**
- Track watch time per user
- Video completion rate
- Drop-off points (where users stop watching)
- Most rewatched sections
- Playback quality analytics

**Options:**

#### **Vimeo Analytics:** ✅
- Built-in analytics
- Heatmaps (engagement over time)
- Watch time, completion rate
- **Cost:** Included

#### **Custom Analytics (Self-hosted):**
- Track video.js events:
```javascript
player.on('timeupdate', () => {
  const currentTime = player.currentTime();
  // Send to analytics backend every 10 seconds
  if (Math.floor(currentTime) % 10 === 0) {
    sendAnalytics({
      videoId: 'course_001_lesson_001',
      userId: currentUser.id,
      watchedTime: currentTime,
      totalDuration: player.duration()
    });
  }
});

player.on('ended', () => {
  // Mark video as completed
  markVideoComplete(videoId, userId);
});
```

**Backend:**
- Store in PostgreSQL:
```sql
CREATE TABLE video_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  video_id TEXT,
  watched_seconds INT,
  completed BOOLEAN,
  last_position INT,
  updated_at TIMESTAMP
);
```

---

# 5. MENTOR VIDEO CONFERENCING

## 5.1 Video Call Platform

**What You Need:**
- 1-on-1 video calls (mentor ↔ student)
- Screen sharing (mentor can share presentations)
- Chat during call
- Good quality (720p minimum)
- Recording (optional, for review)
- Mobile support (iOS/Android)
- Reliable (99.9% uptime)

**Comparison:**

| Feature | Zoom | Google Meet | Twilio Video | 100ms | Whereby |
|---------|------|-------------|--------------|-------|---------|
| **1:1 Duration** | ♾️ Unlimited | ♾️ Unlimited | Pay-per-min | Pay-per-min | 45 min (free) |
| **Ease of Use** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ (Dev) | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **API** | ✅ Create meetings | ✅ Via Workspace | ✅ Full control | ✅ Full control | ✅ Limited |
| **Mobile App** | ✅ Excellent | ✅ Good | ⚠️ Custom | ⚠️ Custom | ✅ Good |
| **Recording** | ✅ Built-in | ✅ Built-in | ⚠️ Custom | ✅ Built-in | ❌ No |
| **Screen Share** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Cost/month** | ₹2,000-3,000 | ₹125-625/user | ₹18,000 | ₹12,000 | €10-50 |
| **Best For** | ✅ Launch | Workspace users | Custom apps | Custom apps | Small teams |

---

### **Option 1: Zoom** ⭐ (RECOMMENDED)

**Why Zoom:**
- ✅ Most familiar to users (everyone knows Zoom)
- ✅ Reliable & stable
- ✅ Excellent mobile apps
- ✅ Easy API integration
- ✅ Fixed pricing (no surprises)
- ✅ Good quality video
- ✅ Screen sharing, chat, recording
- ✅ No app installation required (browser works)

**Pricing:**
- **Zoom Pro:** $14.99/month (~₹1,200)
  - Unlimited 1:1 meetings
  - Up to 30-hour duration
  - 100 participants (not needed for 1:1)
- **Zoom Business:** $19.99/month (~₹1,600)
  - Same + recording transcripts

**For NUON:**
- Need 1 Zoom Pro account
- Generate unique meeting links for each session via API
- **Cost:** ₹2,000-3,000/month total

**API Integration:**
```javascript
const KJUR = require('jsrsasign');

// Generate Zoom meeting
async function createZoomMeeting(mentorId, studentId, sessionTime) {
  const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ZOOM_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      topic: `Mentorship Session - ${mentorId}`,
      type: 2, // Scheduled meeting
      start_time: sessionTime, // ISO 8601 format
      duration: 30, // minutes
      timezone: 'Asia/Kolkata',
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        waiting_room: true,
        audio: 'both',
        auto_recording: 'none'
      }
    })
  });
  
  const meeting = await response.json();
  return {
    meetingId: meeting.id,
    joinUrl: meeting.join_url,
    startUrl: meeting.start_url // For mentor
  };
}

// Store in database
await db.sessions.update(sessionId, {
  zoom_meeting_id: meetingId,
  zoom_join_url: joinUrl,
  zoom_start_url: startUrl
});

// Send to mentor & student
sendEmail(mentor.email, `Your session link: ${startUrl}`);
sendEmail(student.email, `Your session link: ${joinUrl}`);
```

**Features:**
- Automatic meeting creation
- Unique link per session
- Waiting room (mentor can admit student)
- Recording (save to cloud if needed)
- Chat during session

**Setup Time:** 1-2 days (API approval)

**Best For:** NUON - Simple, reliable, affordable

---

### **Option 2: Google Meet (via Google Workspace)**

**Pros:**
- Good quality
- Familiar to many users
- Included with Google Workspace

**Cons:**
- ⚠️ Requires Google Workspace ($6-18/user/month)
- ⚠️ More expensive per-user
- ⚠️ API less flexible than Zoom

**Pricing:**
- **Business Starter:** $6/user/month (₹500)
- Need accounts for all mentors
- **For 50 mentors:** ₹25,000/month ❌ Expensive

**Best For:** Already using Google Workspace

---

### **Option 3: Twilio Video**

**What it is:** Build custom video app with Twilio SDK

**Pros:**
- Full customization
- White-label (no third-party branding)
- React SDK available

**Cons:**
- ❌ Expensive: ₹1.20/participant/minute
  - 30-min session × 2 participants = 60 mins × ₹1.20 = ₹72 per session
  - 500 sessions/month = ₹36,000/month ❌
- ⚠️ Complex development (2-3 weeks)
- ⚠️ Need to build UI, recording, etc.

**Best For:** Large scale with custom branding needs

---

### **Option 4: 100ms (Indian Startup)**

**What it is:** Build custom video experiences

**Pros:**
- Cheaper than Twilio (₹0.80/participant/minute)
- Indian company, good support
- React SDK
- Recording included

**Cons:**
- Still expensive: ₹48 per 30-min session
- 500 sessions = ₹24,000/month
- Custom development needed

**Best For:** Mid-sized, custom experience

---

### **Option 5: Whereby**

**Pros:**
- Embedded meetings (iframe on your site)
- No app installation
- Clean UI

**Cons:**
- ⚠️ 45-minute limit on free tier
- ⚠️ Limited customization
- €10-50/month per room

**Best For:** Small scale, quick embed

---

**🎯 RECOMMENDATION for NUON:** **Zoom Pro** (₹2,000-3,000/month)

**Why:** Familiar, reliable, affordable, easy API, fixed cost

---

## 5.2 Scheduling Integration

**What You Need:**
- Mentor availability calendar
- Student booking system
- Time slot management
- Automated Zoom link generation
- Email/SMS reminders

**Implementation:**

**Already Built in NUON App ✅**
- Mentor sets availability
- Student books time slot
- System generates Zoom meeting via API
- Stores in database
- Sends reminders 1 hour before

**Reminder System:**
```javascript
// Cron job runs every 10 minutes
async function sendSessionReminders() {
  const upcoming = await db.sessions.findMany({
    where: {
      start_time: {
        gte: new Date(),
        lte: new Date(Date.now() + 60 * 60 * 1000) // Next 1 hour
      },
      reminder_sent: false
    }
  });
  
  for (const session of upcoming) {
    // SMS reminder
    await sendSMS(session.student_phone, 
      `Reminder: Your session with ${session.mentor_name} starts in 1 hour. Link: ${session.zoom_join_url}`
    );
    
    // Push notification
    await sendPushNotification(session.student_id, {
      title: 'Session starting soon!',
      body: `Your session with ${session.mentor_name} starts in 1 hour`,
      data: { sessionId: session.id }
    });
    
    // Mark as sent
    await db.sessions.update(session.id, { reminder_sent: true });
  }
}
```

---

## 5.3 Call Quality Monitoring

**What You Need:**
- Track call quality issues
- Network quality metrics
- Call duration logs
- Drop/disconnect tracking

**Zoom Webhooks:**
- `meeting.started`
- `meeting.ended`
- `participant.joined`
- `participant.left`

**Store in database:**
```sql
CREATE TABLE session_logs (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  event_type TEXT, -- started, ended, participant_joined, etc.
  participant_id TEXT,
  timestamp TIMESTAMP,
  duration INT, -- seconds
  quality_data JSONB -- From Zoom API
);
```

---

# 6. NOTIFICATIONS

## 6.1 Push Notifications

**What You Need:**
- Send push notifications to mobile/web
- Scheduled notifications
- Targeted notifications (specific users)
- Topic-based (all users)
- Rich notifications (images, actions)
- Analytics (delivery rate, open rate)

**Recommended:**

### **Firebase Cloud Messaging (FCM)** ⭐

**Why FCM:**
- ✅ Completely FREE (unlimited notifications)
- ✅ Works on Android, iOS, Web
- ✅ Google's infrastructure (reliable)
- ✅ Rich notifications
- ✅ Topic-based messaging
- ✅ Scheduled notifications
- ✅ Analytics included

**Cost:** **FREE** 🎉

**Setup:**
1. Create Firebase project
2. Add app (Web/Android/iOS)
3. Get FCM credentials
4. Integrate SDK in React app
5. Request notification permission
6. Send notifications from backend

**Frontend (React):**
```javascript
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const messaging = getMessaging();

// Request permission
async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const token = await getToken(messaging, {
      vapidKey: 'YOUR_VAPID_KEY'
    });
    // Send token to backend to store
    await saveDeviceToken(userId, token);
  }
}

// Listen for foreground messages
onMessage(messaging, (payload) => {
  console.log('Notification received:', payload);
  // Show notification
  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/logo.png'
  });
});
```

**Backend (Node.js):**
```javascript
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Send to specific user
async function sendPushNotification(userId, notification) {
  const userTokens = await db.device_tokens.findMany({ userId });
  
  const message = {
    notification: {
      title: notification.title,
      body: notification.body
    },
    data: notification.data,
    tokens: userTokens.map(t => t.token)
  };
  
  const response = await admin.messaging().sendMulticast(message);
  console.log(`${response.successCount} sent, ${response.failureCount} failed`);
}

// Send to topic (all users)
async function sendToAll(notification) {
  const message = {
    notification: {
      title: notification.title,
      body: notification.body
    },
    topic: 'all_users'
  };
  
  await admin.messaging().send(message);
}

// Schedule notification (use cron job)
// Example: New course reminder
cron.schedule('0 9 * * *', async () => {
  await sendToAll({
    title: 'New Course Available!',
    body: 'Check out Advanced Critical Care Nursing'
  });
});
```

**Use Cases in NUON:**
- Course enrollment confirmation
- New course launches
- Session reminders (1 hour before)
- Payment confirmations
- Certificate availability
- News announcements
- Engagement reminders ("You haven't learned in 7 days")

**Setup Time:** 2-3 hours

---

### **Alternative: OneSignal**

**Pros:**
- Easier setup than FCM
- Built-in dashboard for sending notifications
- A/B testing
- Segmentation

**Cons:**
- ⚠️ Free up to 10,000 users, then $9/month

**Best For:** Non-technical teams

**🎯 RECOMMENDATION:** Firebase FCM (free, powerful, well-documented)

---

## 6.2 SMS Notifications

**What You Need:**
- Transactional SMS (OTP, confirmations)
- Promotional SMS (marketing)
- DLT registration (mandatory in India)
- Good delivery rates
- Affordable pricing

**Already Covered in Authentication Section**

**MSG91** (RECOMMENDED)
- ₹0.15-0.40 per SMS
- **Use Cases:**
  - OTP (₹0.25/SMS)
  - Booking confirmations (₹0.20/SMS)
  - Payment receipts (₹0.20/SMS)
  - Session reminders (₹0.20/SMS)

**For 10,000 users:**
- 20,000 OTP/month
- 5,000 transactional/month
- **Total: 25,000 SMS = ₹3,750-10,000/month**

**Template Examples:**
```
OTP Template:
"Your NUON verification code is {#var#}. Valid for 10 minutes. Do not share. - NUON"

Booking Confirmation:
"Your session with {#var#} on {#var#} is confirmed. Join: {#var#} - NUON"

Payment Success:
"Payment of Rs.{#var#} received for {#var#}. Receipt: {#var#} - NUON"
```

---

## 6.3 Email Notifications

**What You Need:**
- Transactional emails (order confirmations, receipts)
- Marketing emails (newsletters, announcements)
- Email templates (HTML)
- Good deliverability (land in inbox, not spam)
- Bounce/complaint handling
- Tracking (opens, clicks)

**Comparison:**

| Feature | SendGrid | Amazon SES | Mailgun | Postmark |
|---------|----------|------------|---------|----------|
| **Free Tier** | 100/day | 62,000/month* | 5,000/month | 100/month |
| **Pricing** | $19.95/month | ₹0.08/1000 | $35/50k | $15/10k |
| **Deliverability** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Ease of Use** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Templates** | ✅ | ⚠️ Limited | ✅ | ✅ |
| **Analytics** | ✅ | ⚠️ Basic | ✅ | ✅ |

*Free tier only when sending from EC2

---

### **Option 1: Amazon SES** ⭐ (CHEAPEST)

**Why SES:**
- ✅ Cheapest (₹0.08 per 1,000 emails)
- ✅ 62,000 emails/month FREE if sending from AWS EC2
- ✅ High deliverability
- ✅ Reliable

**Cons:**
- ⚠️ Requires AWS knowledge
- ⚠️ Need to warm up IP (send gradually to build reputation)
- ⚠️ Template management not as good

**Pricing:**
- ₹0.08 per 1,000 emails
- **For 100,000 emails/month:** ₹800/month 💰

**Setup:**
1. Create AWS account
2. Request SES production access (remove sandbox)
3. Verify sending domain
4. Configure DKIM/SPF
5. Create email templates
6. Integrate with Node.js SDK

**Code Example:**
```javascript
const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'ap-south-1' });

async function sendEmail(to, subject, htmlBody) {
  const params = {
    Source: 'NUON <noreply@nuon.app>',
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: { Data: htmlBody }
      }
    }
  };
  
  await ses.sendEmail(params).promise();
}
```

**Setup Time:** 1-2 days (including domain verification)

**Best For:** High volume, budget-conscious

---

### **Option 2: SendGrid**

**Why SendGrid:**
- ✅ Easy to use
- ✅ Great template editor
- ✅ Detailed analytics
- ✅ Good deliverability
- ✅ API & SMTP

**Pricing:**
- **Free:** 100 emails/day (3,000/month) - good for testing
- **Essentials:** $19.95/month (50,000 emails)
- **Pro:** $89.95/month (100,000 emails)

**For 100,000 emails/month:** $89.95 (~₹7,500) ⚠️ More expensive

**Best For:** Ease of use, marketing teams

---

### **Option 3: Mailgun**

**Pros:**
- Good for developers
- Flexible API
- Email validation

**Pricing:**
- Free: 5,000 emails/month
- Foundation: $35/month (50,000 emails)

**For 100,000 emails:** ~₹6,000/month

**Best For:** Developer-friendly

---

### **Option 4: Postmark**

**Pros:**
- ⭐⭐⭐⭐⭐ Best deliverability
- Transactional-focused
- Beautiful templates

**Cons:**
- More expensive
- No marketing features

**Pricing:**
- $15/month (10,000 emails)
- $50/month (50,000 emails)

**For 100,000 emails:** ~₹10,000/month

**Best For:** Critical transactional emails (receipts, confirmations)

---

**🎯 RECOMMENDATION for NUON:**

**Phase 1 (Launch):** Amazon SES (₹800/month for 100K emails)
**Phase 2 (Scale):** SendGrid or Mailgun (better analytics & templates)

---

### Email Templates Needed

**Transactional:**
1. Welcome email (after signup)
2. Course purchase confirmation
3. Payment receipt
4. Session booking confirmation
5. Session reminder (24 hours before)
6. Certificate ready
7. Password reset (if email login added)

**Marketing:**
1. Weekly learning summary
2. New course announcement
3. Promotional offers
4. Newsletter
5. Re-engagement (inactive users)

**Template Example (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #9333EA, #EC4899); padding: 30px; }
    .button { background: #9333EA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: white;">Welcome to NUON! 🎉</h1>
    </div>
    <div style="padding: 30px;">
      <p>Hi {{user_name}},</p>
      <p>Thank you for joining NUON, India's leading nursing education platform.</p>
      <p>Your learning journey starts now!</p>
      <a href="{{app_link}}" class="button">Start Learning</a>
    </div>
  </div>
</body>
</html>
```

---

# 7. ANALYTICS & MONITORING

## 7.1 User Analytics

**What You Need:**
- Track user behavior (page views, clicks, events)
- Conversion funnels (signup → purchase → completion)
- User retention (7-day, 30-day)
- User segmentation
- A/B testing results
- Custom events

**Recommended Stack:**

### **Google Analytics 4** ⭐ (FREE)

**Why GA4:**
- ✅ Completely FREE
- ✅ Industry standard
- ✅ Event-based tracking
- ✅ Funnel analysis
- ✅ Audience segmentation
- ✅ Integrates with Google Ads

**What to Track:**
- Page views
- Signup flow (started, completed, dropped)
- Course views, enrollments
- Video watch events
- Purchase events
- Search queries

**Setup:**
```html
<!-- In index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Track Custom Events:**
```javascript
// Course enrollment
gtag('event', 'course_enrollment', {
  course_id: 'course_001',
  course_name: 'Advanced Critical Care',
  value: 4999,
  currency: 'INR'
});

// Video watch
gtag('event', 'video_watch', {
  video_id: 'lesson_001',
  video_name: 'ICU Fundamentals',
  progress: 75 // percentage
});

// Purchase
gtag('event', 'purchase', {
  transaction_id: 'TXN123',
  value: 4999,
  currency: 'INR',
  items: [{
    item_id: 'course_001',
    item_name: 'Advanced Critical Care',
    price: 4999,
    quantity: 1
  }]
});
```

**Setup Time:** 1-2 hours

---

### **Mixpanel or Amplitude** (Product Analytics)

**Why You Need This (in addition to GA4):**
- ✅ Better user cohort analysis
- ✅ Retention tracking
- ✅ Funnel visualization
- ✅ User journey mapping
- ✅ Real-time data

**Mixpanel:**
- **Free Tier:** 100,000 tracked users/month (good for launch)
- **Paid:** From $24/month for 1M events
- **Best For:** Detailed user behavior

**Amplitude:**
- **Free Tier:** 10M events/month (very generous)
- **Paid:** From $49/month
- **Best For:** Large scale

**Example Events:**
```javascript
// With Mixpanel
mixpanel.track('Course Enrolled', {
  course_id: 'course_001',
  course_name: 'Advanced Critical Care',
  price: 4999,
  user_type: 'new' // or 'returning'
});

mixpanel.track('Video Progress', {
  video_id: 'lesson_001',
  progress: 75,
  speed: 1.5,
  quality: '720p'
});

// Identify user
mixpanel.identify(userId);
mixpanel.people.set({
  $name: 'User Name',
  $email: 'user@email.com',
  plan: 'free',
  courses_enrolled: 3
});
```

**Setup Time:** 2-3 hours

**🎯 RECOMMENDATION:** Google Analytics 4 + Amplitude (free tier)

---

## 7.2 Error Tracking

**What You Need:**
- Real-time error notifications
- Stack traces
- User context (which user encountered error)
- Breadcrumbs (events leading to error)
- Release tracking
- Performance monitoring

### **Sentry** ⭐ (RECOMMENDED)

**Why Sentry:**
- ✅ Best-in-class error tracking
- ✅ Source maps support (see original code, not minified)
- ✅ User context
- ✅ Breadcrumbs (user actions before error)
- ✅ Release tracking
- ✅ Integrations (Slack, email alerts)

**Pricing:**
- **Free:** 5,000 errors/month
- **Team:** $26/month (50,000 errors)
- **Business:** $80/month (500,000 errors)

**For 10,000 users:** Team plan (₹2,000/month) should be enough

**Setup (React):**
```javascript
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://xxxxx@sentry.io/xxxxx",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.1, // 10% of transactions
  environment: process.env.NODE_ENV,
  beforeSend(event, hint) {
    // Don't send errors in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  }
});
```

**Capture Errors:**
```javascript
try {
  // Some code
} catch (error) {
  Sentry.captureException(error, {
    user: {
      id: currentUser.id,
      email: currentUser.email
    },
    extra: {
      courseId: 'course_001',
      action: 'video_play'
    }
  });
}
```

**Setup Time:** 1-2 hours

---

### Alternative: **LogRocket**

**What it is:** Session replay + error tracking

**Pros:**
- ✅ Records user sessions (video replay)
- ✅ See exactly what user did before error
- ✅ Console logs included

**Cons:**
- ⚠️ More expensive ($99/month)
- ⚠️ Privacy concerns (records everything)

**Best For:** Complex debugging

**🎯 RECOMMENDATION:** Sentry (error tracking) + Mixpanel (user analytics)

---

## 7.3 Application Performance Monitoring (APM)

**What You Need:**
- Track API response times
- Database query performance
- Slow endpoints identification
- Server resource usage
- Uptime monitoring

### **Option 1: New Relic**

**Pros:**
- Full-stack monitoring
- Frontend + Backend + Database
- Detailed performance insights

**Pricing:**
- **Free Tier:** 100GB data/month
- **Paid:** From $99/month

**Setup Time:** 2-3 hours

---

### **Option 2: Better Stack (formerly Logtail)**

**Pros:**
- Affordable
- Log management + uptime monitoring

**Pricing:**
- From $10/month

**Setup Time:** 1-2 hours

---

### **Option 3: Self-Hosted (Free)**

**Grafana + Prometheus:**
- FREE open-source
- Requires server setup
- More technical

**Setup Time:** 1-2 days

---

**🎯 RECOMMENDATION for NUON:**

**Phase 1:** Keep it simple, skip APM (not critical for launch)
**Phase 2:** Add New Relic or Better Stack (when scaling)

---

## 7.4 Uptime Monitoring

**What You Need:**
- Check if app is up every 5 minutes
- Get alerted if app goes down
- Public status page
- Multiple location checks

### **UptimeRobot** ⭐ (FREE)

**Why UptimeRobot:**
- ✅ Completely FREE for up to 50 monitors
- ✅ 5-minute interval checks
- ✅ Email/SMS/Slack alerts
- ✅ Public status page
- ✅ API endpoint monitoring
- ✅ HTTP/HTTPS monitoring

**What to Monitor:**
- Homepage (https://nuon.app)
- API health endpoint (https://api.nuon.app/health)
- Database connectivity

**Setup:**
1. Sign up at uptimerobot.com
2. Add monitors for:
   - Main app URL
   - API health endpoint
   - Critical pages
3. Set up alerts (email/Slack)
4. Create public status page (status.nuon.app)

**Setup Time:** 30 minutes

**Alerts:**
- Email: support@nuon.app
- SMS: Tech lead phone
- Slack: #alerts channel

**Cost:** FREE 🎉

---

### Alternative: **Better Uptime**

**Pros:**
- Beautiful status pages
- Incident management

**Pricing:**
- $18/month for 10 monitors

**Best For:** Professional status pages

**🎯 RECOMMENDATION:** UptimeRobot (free, reliable)

---

# 8. DEVELOPMENT TOOLS

## 8.1 Version Control

### **GitHub** ⭐

**What You Need:**
- Git repositories for code
- Pull request workflow
- Code review
- Branch protection
- CI/CD integration

**Pricing:**
- **Free:** Unlimited private repos, unlimited collaborators
- **Team:** $4/user/month (optional features)

**Setup:**
1. Create organization: nuon-app
2. Create repos:
   - nuon-frontend (React app)
   - nuon-backend (Node.js API)
   - nuon-admin (Admin panel)
3. Set up branch protection on `main`
4. Enable GitHub Actions for CI/CD

**Cost:** FREE for small teams

---

## 8.2 CI/CD Pipeline

**What You Need:**
- Automatic testing on pull requests
- Automatic deployment on merge
- Build & test on every push
- Environment variables management

### **GitHub Actions** ⭐ (RECOMMENDED)

**Why GitHub Actions:**
- ✅ Integrated with GitHub
- ✅ Free for public repos
- ✅ 2,000 minutes/month for private repos
- ✅ Easy YAML configuration

**Pricing:**
- **Free:** 2,000 build minutes/month
- Enough for small teams

**Example Workflow:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

**Setup Time:** 2-3 hours

---

### Alternatives:

**GitLab CI:** Built into GitLab
**CircleCI:** $30/month
**Jenkins:** Free, self-hosted (complex)

**🎯 RECOMMENDATION:** GitHub Actions

---

## 8.3 Development Environment

**What Developers Need:**

**Software:**
- Node.js 18+ LTS
- PostgreSQL 14+
- Redis (optional)
- Git
- VS Code or preferred IDE

**VS Code Extensions:**
- ES Lint
- Prettier
- Tailwind CSS IntelliSense
- GitLens
- Thunder Client (API testing)

**All FREE**

---

## 8.4 API Documentation

**What You Need:**
- Document all API endpoints
- Request/response examples
- Authentication guide
- Error codes

### **Swagger/OpenAPI** ⭐ (FREE)

**Why Swagger:**
- ✅ Industry standard
- ✅ Auto-generated docs
- ✅ Interactive API testing
- ✅ Free & open-source

**Example:**
```javascript
/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/courses', getCourses);
```

**Setup Time:** 1-2 days

---

### Alternative: **Postman**

**Pros:**
- Collections for API testing
- Can generate documentation

**Best For:** Testing + docs

**🎯 RECOMMENDATION:** Swagger for documentation + Postman for testing

---

# 9. ADMIN PANEL

**What You Need:**
- Dashboard for managing the app
- User management (view, edit, suspend users)
- Course management (create, edit, publish courses)
- Mentor management (approve, track mentors)
- Payment tracking (view transactions, process refunds)
- Analytics dashboard (key metrics)
- Content management (news, announcements)

**Options:**

### **Option 1: Custom-Built with React Admin** ⭐ (RECOMMENDED)

**React Admin:**
- FREE open-source framework
- Built for React
- Connects to REST/GraphQL APIs
- Rich component library
- Customizable

**Features:**
- CRUD operations for all resources
- Filters & search
- Bulk actions
- Role-based access control
- Dashboard widgets

**Pros:**
- ✅ Full control
- ✅ Matches your API
- ✅ Free
- ✅ Customizable

**Cons:**
- ⚠️ Development time (4-6 weeks)

**Setup Time:** 4-6 weeks development

**Cost:** FREE (developer time only)

---

### **Option 2: Refine**

**What it is:** Headless admin framework

**Pros:**
- Modern React framework
- TypeScript support
- Ant Design / Material UI
- Great DX

**Similar to React Admin**

**Cost:** FREE

---

### **Option 3: Retool** (No-Code)

**What it is:** Drag-and-drop admin builder

**Pros:**
- ✅ Very fast (build in days, not weeks)
- ✅ Connects to PostgreSQL
- ✅ Good UI components

**Cons:**
- ⚠️ Expensive ($10/user/month, minimum $50/month)
- ⚠️ Less customization

**Pricing:**
- Team: $10/user/month
- For 5 admins: $50/month (₹4,000)

**Best For:** Quick MVP, non-technical teams

---

### **Option 4: Budibase / Appsmith** (Open-Source No-Code)

**Pros:**
- FREE (self-hosted)
- No-code builder
- Open-source

**Cons:**
- Requires server for hosting

**Best For:** Budget-friendly quick build

---

**🎯 RECOMMENDATION for NUON:**

**Phase 1:** Custom-built with **React Admin** or **Refine** (full control, free)
**Alternative:** Retool (if you want to launch admin quickly and don't mind cost)

---

### Features to Build:

**1. Dashboard:**
- Total users, courses, revenue (KPI cards)
- Revenue chart (last 30 days)
- Recent enrollments
- Recent transactions

**2. User Management:**
- List all users (table with filters)
- Search by name, email, phone
- View user details
- Edit user info
- Suspend/activate account
- View user's courses & progress

**3. Course Management:**
- List all courses
- Create new course
- Edit course (title, description, price)
- Add/edit modules & lessons
- Upload videos
- Create quizzes
- Publish/unpublish
- View enrollment stats

**4. Mentor Management:**
- List mentor applications
- Approve/reject mentors
- View mentor details
- Edit mentor profile
- View sessions & earnings
- Suspend mentor

**5. Payment Management:**
- List all transactions
- Filter by date, status, amount
- View transaction details
- Process refunds
- Export to CSV

**6. Content Management:**
- Create news/announcements
- Publish/schedule posts
- Manage categories

**7. Analytics:**
- User growth chart
- Revenue trends
- Course performance
- Mentor performance

---

## 9.2 Admin Access Control

**What You Need:**
- Role-based access (Super Admin, Content Manager, Support Agent)
- Permissions management
- Audit logs (who changed what)

**Implementation:**
```javascript
// Database schema
CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  password_hash TEXT,
  role TEXT, -- super_admin, content_manager, support_agent
  permissions JSONB,
  created_at TIMESTAMP
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id),
  action TEXT, -- user_updated, course_published, etc.
  resource_type TEXT, -- user, course, payment
  resource_id UUID,
  changes JSONB,
  timestamp TIMESTAMP
);
```

**Roles & Permissions:**
- **Super Admin:** Full access
- **Content Manager:** Manage courses, news (no user/payment access)
- **Support Agent:** View users, process refunds (no course editing)

---

# 10. TESTING & QA

## 10.1 Automated Testing

**What You Need:**
- Unit tests (test individual functions)
- Integration tests (test API endpoints)
- E2E tests (test user flows)
- Test coverage reporting

**Tools:**

### **Unit & Integration Tests**

**Jest** ⭐ (FREE)
- JavaScript testing framework
- Built into Create React App
- **Cost:** FREE

**React Testing Library** ⭐
- Test React components
- **Cost:** FREE

**Supertest**
- Test backend APIs
- **Cost:** FREE

**Example:**
```javascript
// Component test
import { render, screen } from '@testing-library/react';
import { CourseCard } from './CourseCard';

test('renders course title', () => {
  render(<CourseCard title="Advanced Critical Care" price={4999} />);
  expect(screen.getByText('Advanced Critical Care')).toBeInTheDocument();
  expect(screen.getByText('₹4,999')).toBeInTheDocument();
});

// API test
const request = require('supertest');
const app = require('./app');

describe('GET /api/courses', () => {
  it('returns list of courses', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(20);
  });
});
```

---

### **E2E Tests**

**Cypress** or **Playwright** ⭐

**Cypress:**
- Easier to learn
- Great DX
- **Cost:** FREE (open-source)

**Playwright:**
- Faster
- Multi-browser (Chrome, Firefox, Safari)
- **Cost:** FREE

**Example (Cypress):**
```javascript
describe('Course Purchase Flow', () => {
  it('allows user to purchase a course', () => {
    cy.visit('/courses/course_001');
    cy.get('[data-testid="enroll-button"]').click();
    cy.get('[data-testid="payment-method-upi"]').click();
    cy.get('[data-testid="pay-button"]').click();
    // Assert payment success
    cy.contains('Payment Successful').should('be.visible');
  });
});
```

**Setup Time:** 1-2 weeks to write tests

**🎯 RECOMMENDATION:** Jest + React Testing Library + Playwright

---

## 10.2 Load Testing

**What You Need:**
- Test how many concurrent users app can handle
- Find bottlenecks
- Test before launch

**Tool: k6** ⭐ (FREE)

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 500 }, // Ramp up to 500
    { duration: '5m', target: 500 },
    { duration: '2m', target: 0 },   // Ramp down
  ],
};

export default function () {
  const res = http.get('https://api.nuon.app/courses');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

**Run:**
```bash
k6 run load-test.js
```

**Setup Time:** 1-2 days

---

## 10.3 Mobile Testing

**What You Need:**
- Test on different devices (iPhone, Android)
- Test different screen sizes
- Test different browsers

**Options:**

**Physical Devices:**
- 2-3 Android phones (different sizes)
- 1-2 iPhones
- **Cost:** ₹15,000-40,000 (one-time)

**BrowserStack** (Device Cloud):
- Test on 2000+ real devices
- **Cost:** $39/month (₹3,000)
- **Best For:** Testing many devices without buying them

**Chrome DevTools** (FREE):
- Built into Chrome
- Device emulation
- Good for development

**🎯 RECOMMENDATION:**
- **Development:** Chrome DevTools (free)
- **QA:** BrowserStack ($39/month) or 3-4 physical devices

---

# 11. THIRD-PARTY APIs

## 11.1 Required APIs

These APIs are **MUST HAVE** for NUON to function:

1. ✅ **Razorpay API** - Payment processing
2. ✅ **MSG91 API** - SMS (OTP & notifications)
3. ✅ **SendGrid/SES API** - Email notifications
4. ✅ **Firebase API** - Push notifications
5. ✅ **Zoom API** - Video conferencing
6. ✅ **Cloudinary API** - Image management

**Total Monthly Cost:** ₹15,000-30,000

---

## 11.2 Optional APIs

These can be added later:

- **WhatsApp Business API** - Customer support (₹5-10/conversation)
- **Google Maps API** - Location features (if showing mentor/user locations)
- **LinkedIn API** - Share certificates on LinkedIn
- **DigiLocker API** - Verify nursing certificates (government integration)
- **Twilio Voice API** - Voice calls (if adding phone support)

---

# 12. BACKUP & DISASTER RECOVERY

## 12.1 Database Backups

**What You Need:**
- Daily automated backups
- 7-day retention (minimum)
- Point-in-time recovery
- Test restore monthly

**Solutions:**

**If using Supabase:**
- Daily backups included ✅
- 7-day retention (free tier)
- 30-day retention (Pro plan)
- **Cost:** Included

**If using AWS RDS:**
- Automated backups (enable in settings)
- 7-35 day retention
- Point-in-time recovery
- **Cost:** Usually included (or ₹500-2,000/month)

**If using DigitalOcean:**
- Daily backups (optional add-on)
- **Cost:** +20% of droplet cost

**🎯 RECOMMENDATION:** Enable automated backups on day 1

**Backup Testing:**
- Test restore every month
- Document restore procedure
- Keep restore time < 4 hours

---

## 12.2 File Backups

**What You Need:**
- Backup videos, images, documents
- Redundant storage

**Solutions:**

**If using S3/Backblaze:**
- Built-in redundancy ✅
- Versioning (optional)
- Cross-region replication (for critical data)
- **Cost:** Minimal (storage cost only)

**If using Cloudinary:**
- Automatic backups included ✅
- **Cost:** Included

**🎯 RECOMMENDATION:** Use S3 versioning for critical files

---

## 12.3 Disaster Recovery Plan

**Recovery Objectives:**
- **RTO (Recovery Time Objective):** 4 hours
  - How fast can we restore service after disaster
- **RPO (Recovery Point Objective):** 1 hour
  - How much data can we afford to lose

**Recovery Steps:**
1. Database: Restore from latest backup
2. Files: Already redundant (S3/Backblaze)
3. Code: Deploy from GitHub
4. DNS: Update if needed
5. Test critical flows

**Estimated Total Recovery Time:** 2-4 hours

**🎯 ACTION:** Document recovery procedure, test annually

---

# 13. RECOMMENDED TECH STACK SUMMARY

## Frontend
- ✅ **Framework:** React 18+
- ✅ **Build Tool:** Vite
- ✅ **Styling:** Tailwind CSS v4
- ✅ **UI Components:** shadcn/ui
- ✅ **State Management:** React Context / Zustand
- ✅ **Routing:** React Router v6
- ✅ **Forms:** React Hook Form + Zod validation
- ✅ **HTTP Client:** Fetch API / Axios
- ✅ **Icons:** Lucide React
- ✅ **Charts:** Recharts
- ✅ **Animation:** Motion (Framer Motion)
- ✅ **Hosting:** Vercel

## Backend
- ✅ **Runtime:** Node.js 18+ LTS
- ✅ **Framework:** Express.js or Fastify
- ✅ **Language:** TypeScript
- ✅ **ORM:** Prisma or Drizzle
- ✅ **Validation:** Zod
- ✅ **Authentication:** JWT or Supabase Auth
- ✅ **Hosting:** Railway or DigitalOcean App Platform

## Database
- ✅ **Primary:** PostgreSQL 14+
- ✅ **Hosting:** Supabase (recommended) or AWS RDS
- ✅ **Cache:** Upstash Redis (optional)

## File Storage
- ✅ **Videos:** Backblaze B2 or Vimeo
- ✅ **Images:** Cloudinary
- ✅ **Documents:** Backblaze B2 or AWS S3

## Infrastructure
- ✅ **CDN:** Cloudflare (free tier)
- ✅ **SSL:** Let's Encrypt (free, auto)
- ✅ **Domain:** Namecheap or GoDaddy

## Third-Party Services
- ✅ **Payments:** Razorpay
- ✅ **SMS:** MSG91
- ✅ **Email:** Amazon SES or SendGrid
- ✅ **Push Notifications:** Firebase FCM
- ✅ **Video Calls:** Zoom Pro
- ✅ **Error Tracking:** Sentry
- ✅ **Analytics:** Google Analytics 4 + Amplitude
- ✅ **Uptime Monitoring:** UptimeRobot

## Development
- ✅ **Version Control:** GitHub
- ✅ **CI/CD:** GitHub Actions
- ✅ **API Docs:** Swagger
- ✅ **Testing:** Jest + Playwright
- ✅ **Code Editor:** VS Code

---

# TOTAL ESTIMATED MONTHLY TECH COSTS

## For 10,000 Users (Estimated)

| Category | Service | Monthly Cost (INR) |
|----------|---------|-------------------|
| **Hosting & Infrastructure** |
| Frontend Hosting | Vercel | Free-₹1,500 |
| Backend Hosting | Railway/DO | ₹2,000-8,000 |
| Database | Supabase Pro | ₹2,000-8,000 |
| CDN | Cloudflare | Free |
| File Storage | Backblaze + Cloudinary | ₹1,000-3,000 |
| Cache | Upstash Redis | Free-₹2,000 |
| **Communication** |
| SMS (OTP + Alerts) | MSG91 | ₹3,000-10,000 |
| Email | Amazon SES | ₹800-2,000 |
| Push Notifications | Firebase | Free |
| **Payments & Video** |
| Payment Gateway Fees | Razorpay | ₹17,000-20,000* |
| Mentor Payouts | Razorpay Route | ₹2,000-5,000 |
| Video Hosting | Vimeo Premium | ₹6,000-12,000 |
| Video Calls | Zoom Pro | ₹2,000-3,000 |
| **Analytics & Monitoring** |
| Analytics | GA4 + Amplitude | Free |
| Error Tracking | Sentry | Free-₹2,000 |
| Uptime Monitoring | UptimeRobot | Free |
| **Support & Tools** |
| Customer Support | Freshdesk | ₹2,000-5,000 |
| Admin Panel | Custom-built | Free |
| **TOTAL (Low Estimate)** | | **₹37,800** |
| **TOTAL (High Estimate)** | | **₹81,500** |

*Payment gateway fees are ~2% of revenue. Assumes ₹10L monthly revenue.

---

# 14. MOBILE APP PUBLISHING

## 14.1 Google Play Store (Android)

### A. Developer Account Setup

**What You Need:**
- Google Play Developer account
- Business/organization details
- Payment method (credit/debit card)
- Tax information

**Cost:**
- **One-time registration fee:** $25 (~₹2,000)
- **No annual renewal fee** ✅

**Registration Process:**
1. Go to https://play.google.com/console/signup
2. Pay $25 registration fee
3. Complete developer profile
4. Verify email & phone
5. Accept Developer Distribution Agreement
6. Set up merchant account (for paid apps/in-app purchases)

**Time to Approval:** Immediate (after payment)

**🎯 RECOMMENDATION:** Register as soon as you plan to publish

---

### B. App Requirements & Store Listing

**Technical Requirements:**
- **Format:** Android App Bundle (.aab) ⭐ (recommended by Google)
- **Minimum SDK:** Android 6.0 (API level 23) or higher
- **Target SDK:** Latest (Android 14, API level 34 as of 2024)
- **Size:** Under 150MB (recommended)

**Required Assets:**
- **App Icon:** 512x512 pixels, PNG
- **Feature Graphic:** 1024x500 pixels
- **Screenshots:** Minimum 2, recommended 4-8
- **Privacy Policy URL:** MANDATORY
- **Content Rating:** Complete questionnaire
- **App Category:** Education

**Review Timeline:**
- **First submission:** 3-7 days
- **Updates:** 1-3 days

---

### C. Google Play Billing (In-App Purchases)

**⚠️ IMPORTANT for NUON:**

If course prices are >$3 (₹250), you **MUST** use Google Play Billing for in-app purchases.

**Google Play Commission:**
- **15%** for first $1M revenue/year (small businesses)
- **30%** after $1M

**Alternative (Recommended for NUON):** ⭐
- Direct users to **website for purchase** (Razorpay)
- Complete payment on website
- Sync purchases to app via API
- **Allowed** as long as you don't link directly from app
- **Mentorship sessions:** Can use Razorpay (one-on-one services exempt ✅)

---

## 14.2 Apple App Store (iOS)

### A. Developer Account Setup

**Cost:**
- **Annual fee:** $99/year (~₹8,000/year)
- **Must renew every year** ⚠️

**Registration Process:**
1. Go to https://developer.apple.com/programs/enroll/
2. Choose Individual or Organization
3. For Organization: D-U-N-S number required (takes 1-2 weeks)
4. Pay $99 annual fee
5. Wait for approval (1-2 weeks for organization)

---

### B. App Requirements & Store Listing

**Required Assets:**
- **App Icon:** 1024x1024 pixels, PNG
- **Screenshots:** Required for ALL device sizes (iPhone, iPad)
- **App Name:** Max 30 characters
- **Subtitle:** Max 30 characters
- **Keywords:** Max 100 characters (crucial for SEO)
- **Privacy Policy URL:** MANDATORY

**Review Timeline:**
- **First submission:** 24-48 hours (up to 7 days)
- **Updates:** 24 hours typically
- **Stricter review** than Google Play

---

### C. Apple In-App Purchases (MANDATORY)

**⚠️ CRITICAL for iOS:**

Apple **STRICTLY ENFORCES** In-App Purchase rules:
- **MUST use Apple In-App Purchase** for digital goods (courses)
- **30% commission** (15% for Small Business Program <$1M revenue/year)
- **Cannot link** to external website for payment
- Violations result in app rejection/removal

**Apple's Small Business Program:**
- **15% commission** for developers earning <$1M/year ✅
- Automatically enrolled if eligible
- Apply: https://developer.apple.com/app-store/small-business-program/

**Exemptions:**
- **Mentorship sessions:** One-on-one services exempt ✅
- Can use external payment (Razorpay)

---

## 14.3 Progressive Web App (PWA) Alternative ⭐

### Should NUON Be a PWA Instead?

**NUON is Already a PWA!** ✅

**Pros of PWA:**
- ✅ **No 15-30% app store commission** (**HUGE saving**)
- ✅ No app store review process (instant updates)
- ✅ One codebase (already built!)
- ✅ No developer account fees
- ✅ Direct Razorpay integration (no restrictions)
- ✅ Works on all platforms

**Cons of PWA:**
- ⚠️ Less discoverable (no app store listing)
- ⚠️ Users less familiar with "install" process
- ⚠️ No app store credibility

---

## 14.4 Cost Comparison Summary

### Native App Store Publishing Costs

**One-Time Costs:**
| Item | Cost (INR) |
|------|------------|
| Google Play Developer Account | ₹2,000 (one-time) |
| Apple Developer Account (Year 1) | ₹8,000 |
| App icon & screenshots design | ₹10,000-25,000 |
| **TOTAL** | **₹20,000-35,000** |

**Annual Recurring:**
| Item | Cost (INR) |
|------|------------|
| Apple Developer Account | ₹8,000/year |
| Google Play | ₹0 |
| **TOTAL** | **₹8,000/year** |

**Commission on Revenue:**
| Platform | Commission | On ₹10L Revenue | On ₹50L Revenue |
|----------|------------|-----------------|-----------------|
| Google Play | 15% | ₹1,50,000 | ₹7,50,000 |
| Apple App Store | 15% (Small Business) | ₹1,50,000 | ₹7,50,000 |
| **TOTAL ANNUAL** | | **₹3,00,000** | **₹15,00,000** |

### PWA Approach Costs

**One-Time Costs:** ₹0-20,000 (optimization)  
**Annual Costs:** ₹0  
**Commission:** ₹0 (only 2% Razorpay gateway fee)

### 💰 Cost Savings: PWA vs Native Apps

**Annual Savings on ₹10L Revenue:**
- Native apps commission: ₹3,00,000
- PWA commission: ₹0
- **SAVINGS: ₹3,00,000/year** 🎉

**Annual Savings on ₹50L Revenue:**
- Native apps commission: ₹15,00,000
- PWA commission: ₹0
- **SAVINGS: ₹15,00,000/year** 🎉🎉🎉

---

## 14.5 FINAL RECOMMENDATION FOR NUON 🎯

### **Phase 1: PWA Launch (Month 1-3)** ⭐
- ✅ Launch as PWA immediately (already built!)
- ✅ Market to nursing professionals directly
- ✅ Save 15-30% app store commission
- ✅ Iterate quickly based on feedback

**Estimated Revenue (₹10L) - Commission Saved: ₹3L**

---

### **Phase 2: Play Store Launch (Month 4-6)**
- ✅ Submit to Google Play Store (₹2,000 one-time)
- ✅ Improve discoverability
- ⚠️ Use external website payment for courses (avoid 15% fee)
- ✅ Use in-app Razorpay for mentorship (exempt)

**Estimated Revenue (₹25L) - Commission Saved: ₹3.75L**

---

### **Phase 3: App Store Launch (Month 7-9)**
- ✅ Submit to Apple App Store (₹8,000/year)
- ✅ Enroll in Small Business Program (15% vs 30%)
- ⚠️ Use Apple IAP for courses (unavoidable)
- ✅ Accept 15% commission on iOS sales

**Estimated iOS Revenue (₹10L) - Commission: ₹1.5L**

---

### **Total Annual Costs & Savings:**

| Channel | Setup Cost | Annual Cost | Revenue | Commission | Net |
|---------|------------|-------------|---------|------------|-----|
| PWA (Direct) | ₹0-20K | ₹0 | ₹25L | ₹0 | ₹25L |
| Google Play | ₹2K | ₹0 | ₹15L | ₹0* | ₹15L |
| Apple App Store | ₹8K | ₹8K | ₹10L | ₹1.5L (15%) | ₹8.5L |
| **TOTAL** | **₹10-30K** | **₹8K** | **₹50L** | **₹1.5L** | **₹48.5L** |

*Assuming external payment for courses on Android

**vs Traditional Native-Only Approach:**
- Total revenue: ₹50L
- Commission (15% both platforms): ₹7.5L
- Net: ₹42.5L

**YOUR SAVINGS: ₹6L/year** by using PWA + strategic app store approach! 🎉

---

**Status:** ✅ Complete Mobile Publishing Strategy  
**Estimated Setup Time:** 4-6 weeks (for app store readiness)  
**Estimated Annual Savings:** ₹3-15L (depending on revenue)

---

# PHASED IMPLEMENTATION TIMELINE

## Phase 1: MVP Foundation (Weeks 1-4)
- ✅ Set up hosting (Vercel + Railway)
- ✅ Set up database (Supabase)
- ✅ Integrate Razorpay payments
- ✅ Set up MSG91 SMS
- ✅ Firebase push notifications
- ✅ Basic analytics (GA4)

## Phase 2: Core Features (Weeks 5-8)
- ✅ Video hosting (Vimeo)
- ✅ Zoom integration
- ✅ Email service (SES)
- ✅ Error tracking (Sentry)
- ✅ Uptime monitoring (UptimeRobot)

## Phase 3: Scale & Optimize (Weeks 9-12)
- ✅ Advanced analytics (Amplitude/Mixpanel)
- ✅ Admin panel completion
- ✅ Load testing
- ✅ Backup & disaster recovery setup
- ✅ Security audit

## Phase 4: Production Ready (Week 13+)
- ✅ Penetration testing
- ✅ Performance optimization
- ✅ Documentation
- ✅ Training team
- ✅ Soft launch
- ✅ Public launch

---

**Status:** ✅ Complete Technical Blueprint  
**Ready for:** Implementation Planning & Development  
**Estimated Dev Time:** 3-4 months with full team  
**Estimated Monthly Tech Costs:** ₹38K-82K (10K users)

---

This comprehensive guide covers all technical dependencies needed to successfully launch and scale NUON! 🚀
