# SWE 645 – Assignment 1

**Student:** Meet Rajesh Popat  
**Course:** SWE 645  
**Assignment:** Assignment 1: Class Homepage, Student Survey, Amazon S3, and Amazon EC2

## Submission URLs


## Assignment 1:
- **Amazon S3 Homepage:** `http://swe645-meet-popat-assignment1.s3-website.us-east-2.amazonaws.com/index.html`
- **Amazon EC2 Homepage:** `http://ec2-18-217-108-233.us-east-2.compute.amazonaws.com/`

## Assignment 2:
- **Amazon EC2 Homepage:** `http://3.144.37.45/survey.html`


## Project Contents

```text
SWE645_Assignment1_Meet_Popat/
├── index.html              # Class homepage
├── survey.html             # Student Survey form
├── error.html              # Optional custom error page
├── styles.css              # Shared GMU green/gold styling
├── survey.js               # Survey and raffle validation
├── README.md               # Setup/deployment instructions
└── assets/
    └── image.png      #image
```

## Functional Requirements Covered

- Homepage contains a local image and an introductory paragraph.
- Homepage links to the Student Survey page.
- Required survey text fields:
  - First name
  - Last name
  - Street address
  - City
  - State
  - ZIP
  - Telephone
  - E-mail
  - Date of survey
- Campus checkboxes:
  - Students
  - Location
  - Campus
  - Atmosphere
  - Dorm rooms
  - Sports
- Interest-source radio buttons:
  - Friends
  - Television
  - Internet
  - Other
- Recommendation dropdown:
  - Very Likely
  - Likely
  - Unlikely
- Raffle field validates at least 10 comma-separated whole numbers from 1 through 100.
- Additional-comments text area.
- Submit and Cancel/Reset buttons.
- Optional custom `error.html`.
- Responsive GMU-inspired green and gold design.

## Run Locally

Because this site uses only HTML, CSS, and JavaScript, no build process is required.

### Option 1 – Open Directly

Double-click `index.html` and test the navigation and survey.

### Option 2 – Local Web Server

From the project directory:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

# Amazon S3 Static Website Deployment
## 1. Create the S3 Bucket

1. Sign in to the AWS Management Console.
2. Open **Amazon S3**.
3. Select **Create bucket**.
4. Enter a globally unique bucket name, for example:
   `swe645-meet-popat-assignment1`
5. Choose the AWS Region you want to use.
6. Create the bucket.

## 2. Upload the Website Files

Upload the **contents** of this project folder to the bucket root:

- `index.html`
- `survey.html`
- `error.html`
- `styles.css`
- `survey.js`
- `assets/gmu-campus.png`

The `assets` directory must remain a folder so that the image path continues to work.

## 3. Enable Static Website Hosting

1. Open the bucket.
2. Select **Properties**.
3. Scroll to **Static website hosting**.
4. Select **Edit**.
5. Enable **Static website hosting**.
6. Choose **Host a static website**.
7. Set:
   - Index document: `index.html`
   - Error document: `error.html`
8. Save changes.

## 4. Allow Public Read Access for the Assignment Site

S3 buckets block public access by default. A directly public S3 website requires public read access.

1. Open the bucket's **Permissions** tab.
2. Under **Block public access**, select **Edit**.
3. Disable the bucket-level setting that blocks the public access required for the website.
4. Acknowledge the warning and save.

Only do this for the bucket intended to contain public website files.

## 5. Add a Bucket Policy

Under **Permissions - Bucket policy**, use the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::swe645-meet-popat-assignment1/*"
    }
  ]
}
```

Save the policy.

## 6. Test the S3 Website

1. Go back to **Properties - Static website hosting**.
2. Open/copy the **Bucket website endpoint**.
3. Verify:
   - Homepage loads.
   - Image loads.
   - Student Survey link works.
   - Survey validation works.
   - A nonexistent path displays `error.html`.
4. Paste the tested website endpoint into **Submission URLs** at the top of this README.

---

# Amazon EC2 Deployment

These instructions use **Amazon Linux 2023** and the Apache (`httpd`) web server.

## 1. Launch an EC2 Instance

1. Open **Amazon EC2** in AWS.
2. Select **Launch instance**.
3. Give the instance a name such as:
   `SWE645-Assignment1`
4. Choose **Amazon Linux 2023** as the AMI.
5. Select an instance type appropriate for your AWS account/course environment.
6. Create or select an SSH key pair.
7. Configure the security group:
   - SSH, TCP port `22`: preferably restrict the source to **My IP**.
   - HTTP, TCP port `80`: allow `0.0.0.0/0` so the professor can access the site.
8. Launch the instance.

## 2. Connect to EC2

Use the EC2 console's **Connect** option, or SSH from your computer.

Example:

```bash
ssh -i YOUR_KEY.pem ec2-user@YOUR_EC2_PUBLIC_DNS
```

## 3. Install and Start Apache

Run:

```bash
sudo dnf upgrade -y
sudo dnf install -y httpd
sudo systemctl start httpd
sudo systemctl enable httpd
```

Confirm Apache is running:

```bash
sudo systemctl status httpd
```

The Apache document root on Amazon Linux is:

```text
/var/www/html
```

## 4. Copy the Website to the EC2 Instance

### Option A – SCP from Your Computer

From the parent directory of the project:

```bash
scp -i YOUR_KEY.pem -r SWE645_Assignment1_Meet_Popat/* ec2-user@YOUR_EC2_PUBLIC_DNS:/home/ec2-user/site/
```

If `/home/ec2-user/site/` does not exist yet, first connect to EC2 and run:

```bash
mkdir -p /home/ec2-user/site
```

Then on EC2:

```bash
sudo cp -r /home/ec2-user/site/* /var/www/html/
```

### Option B – Upload Through Your Preferred EC2 File-Transfer Method

Place the same site files inside:

```text
/var/www/html
```

The final server should contain paths similar to:

```text
/var/www/html/index.html
/var/www/html/survey.html
/var/www/html/error.html
/var/www/html/styles.css
/var/www/html/survey.js
/var/www/html/assets/gmu-campus.png
```

## 5. Set Read Permissions

Run:

```bash
sudo find /var/www/html -type d -exec chmod 755 {} \;
sudo find /var/www/html -type f -exec chmod 644 {} \;
sudo systemctl restart httpd
```

## 6. Test the EC2 Website

In the EC2 console, copy the instance's **Public IPv4 DNS** or **Public IPv4 address**.

Open:

```text
http://ec2-18-217-108-233.us-east-2.compute.amazonaws.com/ 
```

Verify:

- Homepage loads.
- Image loads.
- Survey page opens.
- Survey validation works.
- CSS and JavaScript load without errors.

---

# Checklist

- [ ] My name appears in the comments at the top of each source file.
- [ ] `README.md` is included.
- [ ] Source files are included.
- [ ] S3 homepage URL is added to README.
- [ ] EC2 homepage URL is added to README.
- [ ] S3 URL works from a browser.
- [ ] EC2 URL works from a browser.
- [ ] Image loads.
- [ ] Homepage - Student Survey link works.
- [ ] All required survey fields are enforced.
- [ ] Raffle rejects fewer than 10 entries.
- [ ] Raffle rejects values outside 1–100.
- [ ] Submit button works.
- [ ] Cancel/Reset button clears the form.
- [ ] ZIP opens correctly before uploading to Canvas.

## Notes

The survey is implemented as a static front-end form because this assignment asks for an HTML Student Survey and static hosting. The Submit button performs browser-side validation and shows a success confirmation; no database or server-side form processing is required by the assignment specification.