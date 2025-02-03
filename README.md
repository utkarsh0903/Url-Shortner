# URL Shortener

A full-featured URL shortening service built with **React**, **Node.js**, and **MongoDB**. Users can shorten links, track analytics, and manage their URLs efficiently.

## 🚀 Features

### 1️⃣ URL Shortening
- Users can input a long URL and generate a **unique** shortened version.
- Short links are created using a **random hash** (e.g., `https://<hostname>/<6-8 alphanumeric>`).
- Users can **set expiration dates** for links.

### 2️⃣ User Management
- **User Registration & Login** using **email and password**.
- Secure password storage with **hashing**.
- **Account Settings:**
  - **Update Profile:** Users can update their name and email.
    - Updating email logs the user out automatically.
  - **Delete Account:** Deletes all associated links and data.

### 3️⃣ Dashboard
- A user-friendly **dashboard** displaying:
  - **Original URL**.
  - **Shortened URL**.
  - **Click analytics**.
- Users can **edit or delete** their links.

### 4️⃣ Click Tracking
- **Track metadata** for every link click:
  - **Timestamp**.
  - **IP Address**.
  - **User Agent** (browser & OS details).
- Summarized click data is displayed on the **dashboard**.

### 5️⃣ Link Management
- **Edit** original URLs or aliases.
- **Delete** individual links.

### 6️⃣ Analytics
- **Detailed analytics** for each shortened link:
  - **Device type** (mobile, desktop, tablet).
  - **Browser details**.

### 7️⃣ Responsive Design
- Fully **responsive UI** for **desktop and mobile**.

### 8️⃣ Pagination
- **Pagination** added to:
  - **Links List**.
  - **Analytics Dashboard**.

---

## 🛠️ Tech Stack

### Frontend:
- **React**
- **Vanilla CSS**

### Backend:
- **Node.js** with **Express**
- **MongoDB** (Database)

### Hosting:
- **Frontend:** Vercel, [Deployed Link](https://url-shortner-sage-one.vercel.app/) , [Frontend Repo](https://github.com/utkarsh0903/url-shortner-frontend) 
- **Backend:** Render

---

## 📌 Setup Instructions

1️⃣ **Clone the Repository:**
```sh
git clone https://github.com/your-username/url-shortener.git
cd url-shortener

```
2️⃣ **Backend Setup:**
```sh
npm install
npm start
```

2️⃣ **Frontend Setup:**
```sh
npm install
npm start
```

4️⃣ **Access the Application:**
Open http://localhost:3000 in your browser.

---

## 🎮 **Demo Credentials**
Use the following credentials to test the application:

Email: u22@g.c  
Password: 123456
