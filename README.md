# Clinical Authority — Medical Course Platform

A modern Next.js 14 application for **Clinical Authority**, featuring high-yield Pharmacology & Pathology video course sales, Razorpay payment processing, automated Telegram Bot invite link generation upon payment webhook/verification, and Supabase enrollment storage.

---

## Features

- **Exact Visual Design**: Preserves vintage paper texture, warm espresso/brown color scheme, typography (`DM Sans` & `Libre Baskerville`), animations, cards, and responsive layout.
- **Interactive Enrollment & NDA Form**:
  - Student & College verification.
  - Interactive Non-Disclosure Agreement (NDA) document.
  - Digital signature matching validation.
  - Dynamic course price selection (Pharmacology ₹555, Pathology ₹355, Combined Package ₹855).
- **Razorpay Checkout Integration**:
  - Server-side order creation (`/api/razorpay/create-order`).
  - Automatic Razorpay modal popup on checkout.
  - Payment signature verification (`/api/razorpay/verify-payment`).
  - Webhook listener for async payment notifications (`/api/razorpay/webhook`).
- **Telegram Bot Access Generation**:
  - Automated single-use invite link creation via Telegram Bot API (`createChatInviteLink`).
  - Directly displays invite link & copy button on payment completion.
- **Supabase Storage**:
  - Automatically stores verified student enrollments, payment status, roll numbers, signatures, and Telegram access links in the `enrollments` table.

---

## Setup Instructions

### 1. Database Setup (Supabase)
1. Open your [Supabase Dashboard](https://supabase.com/).
2. Navigate to **SQL Editor** and run the script inside `supabase_schema.sql`.
3. Copy your **Supabase URL**, **Anon Key**, and **Service Role Key** into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### 2. Payment Gateway Setup (Razorpay)
1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Go to **Settings > API Keys** and generate Key ID & Secret.
3. Paste keys into `.env.local`:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxx
   RAZORPAY_WEBHOOK_SECRET=xxxxxxx
   ```

### 3. Telegram Bot Setup
1. Message [@BotFather](https://t.me/BotFather) on Telegram to create a bot and obtain the Bot Token.
2. Add your bot as an **Administrator** in your private course channel/group with the permission **"Invite Users via Link"**.
3. Copy the Bot Token & Group Chat ID into `.env.local`:
   ```env
   TELEGRAM_BOT_TOKEN=123456789:ABCdef...
   TELEGRAM_CHAT_ID=-100xxxxxxxxx
   ```

---

## Running Locally

```bash
cmd /c "npm run dev"
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
