export const JOB_CATEGORIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Engineering",
  "Legal",
  "Sales & Marketing",
  "Skilled Trades",
  "Government",
  "Management",
];

export const JOBS = [
  // Technology
  { title: "Software Engineer", category: "Technology", salaryMin: 85000, salaryMax: 150000, salaryMedian: 124000, growth: "25%", educationRequired: "Bachelor's" },
  { title: "Data Scientist", category: "Technology", salaryMin: 95000, salaryMax: 155000, salaryMedian: 127000, growth: "35%", educationRequired: "Master's" },
  { title: "Product Manager", category: "Technology", salaryMin: 100000, salaryMax: 165000, salaryMedian: 135000, growth: "8%", educationRequired: "Bachelor's" },
  { title: "UX Designer", category: "Technology", salaryMin: 70000, salaryMax: 120000, salaryMedian: 92000, growth: "16%", educationRequired: "Bachelor's" },
  { title: "DevOps Engineer", category: "Technology", salaryMin: 90000, salaryMax: 145000, salaryMedian: 118000, growth: "22%", educationRequired: "Bachelor's" },
  { title: "Cybersecurity Analyst", category: "Technology", salaryMin: 75000, salaryMax: 125000, salaryMedian: 102000, growth: "32%", educationRequired: "Bachelor's" },
  { title: "Web Developer", category: "Technology", salaryMin: 55000, salaryMax: 100000, salaryMedian: 78000, growth: "16%", educationRequired: "Associate's" },
  { title: "Database Administrator", category: "Technology", salaryMin: 70000, salaryMax: 120000, salaryMedian: 96000, growth: "8%", educationRequired: "Bachelor's" },
  { title: "IT Manager", category: "Technology", salaryMin: 90000, salaryMax: 150000, salaryMedian: 122000, growth: "15%", educationRequired: "Bachelor's" },
  { title: "Systems Analyst", category: "Technology", salaryMin: 65000, salaryMax: 105000, salaryMedian: 86000, growth: "9%", educationRequired: "Bachelor's" },
  { title: "Machine Learning Engineer", category: "Technology", salaryMin: 110000, salaryMax: 175000, salaryMedian: 145000, growth: "40%", educationRequired: "Master's" },
  { title: "Cloud Architect", category: "Technology", salaryMin: 115000, salaryMax: 170000, salaryMedian: 142000, growth: "23%", educationRequired: "Bachelor's" },

  // Healthcare
  { title: "Registered Nurse", category: "Healthcare", salaryMin: 60000, salaryMax: 95000, salaryMedian: 77000, growth: "6%", educationRequired: "Bachelor's" },
  { title: "Physician Assistant", category: "Healthcare", salaryMin: 105000, salaryMax: 155000, salaryMedian: 126000, growth: "28%", educationRequired: "Master's" },
  { title: "Pharmacist", category: "Healthcare", salaryMin: 120000, salaryMax: 160000, salaryMedian: 132000, growth: "2%", educationRequired: "Doctoral" },
  { title: "Physical Therapist", category: "Healthcare", salaryMin: 70000, salaryMax: 100000, salaryMedian: 87000, growth: "17%", educationRequired: "Doctoral" },
  { title: "Dental Hygienist", category: "Healthcare", salaryMin: 55000, salaryMax: 85000, salaryMedian: 72000, growth: "9%", educationRequired: "Associate's" },
  { title: "Medical Lab Technician", category: "Healthcare", salaryMin: 45000, salaryMax: 70000, salaryMedian: 57000, growth: "7%", educationRequired: "Associate's" },
  { title: "Nurse Practitioner", category: "Healthcare", salaryMin: 95000, salaryMax: 130000, salaryMedian: 118000, growth: "40%", educationRequired: "Master's" },
  { title: "Occupational Therapist", category: "Healthcare", salaryMin: 70000, salaryMax: 100000, salaryMedian: 84000, growth: "14%", educationRequired: "Master's" },
  { title: "Respiratory Therapist", category: "Healthcare", salaryMin: 55000, salaryMax: 80000, salaryMedian: 62000, growth: "14%", educationRequired: "Associate's" },
  { title: "Healthcare Administrator", category: "Healthcare", salaryMin: 70000, salaryMax: 120000, salaryMedian: 101000, growth: "28%", educationRequired: "Master's" },

  // Finance
  { title: "Financial Analyst", category: "Finance", salaryMin: 60000, salaryMax: 110000, salaryMedian: 85000, growth: "9%", educationRequired: "Bachelor's" },
  { title: "Accountant", category: "Finance", salaryMin: 50000, salaryMax: 85000, salaryMedian: 68000, growth: "4%", educationRequired: "Bachelor's" },
  { title: "Financial Advisor", category: "Finance", salaryMin: 60000, salaryMax: 130000, salaryMedian: 89000, growth: "15%", educationRequired: "Bachelor's" },
  { title: "Actuary", category: "Finance", salaryMin: 75000, salaryMax: 150000, salaryMedian: 113000, growth: "21%", educationRequired: "Bachelor's" },
  { title: "Investment Banker", category: "Finance", salaryMin: 85000, salaryMax: 200000, salaryMedian: 140000, growth: "7%", educationRequired: "Bachelor's" },
  { title: "Credit Analyst", category: "Finance", salaryMin: 50000, salaryMax: 85000, salaryMedian: 67000, growth: "6%", educationRequired: "Bachelor's" },
  { title: "Tax Preparer", category: "Finance", salaryMin: 40000, salaryMax: 65000, salaryMedian: 48000, growth: "4%", educationRequired: "High School" },
  { title: "Auditor", category: "Finance", salaryMin: 55000, salaryMax: 95000, salaryMedian: 73000, growth: "4%", educationRequired: "Bachelor's" },
  { title: "Loan Officer", category: "Finance", salaryMin: 45000, salaryMax: 90000, salaryMedian: 63000, growth: "3%", educationRequired: "Bachelor's" },
  { title: "Risk Manager", category: "Finance", salaryMin: 80000, salaryMax: 140000, salaryMedian: 108000, growth: "8%", educationRequired: "Bachelor's" },

  // Education
  { title: "High School Teacher", category: "Education", salaryMin: 45000, salaryMax: 70000, salaryMedian: 56000, growth: "5%", educationRequired: "Bachelor's" },
  { title: "College Professor", category: "Education", salaryMin: 60000, salaryMax: 130000, salaryMedian: 80000, growth: "8%", educationRequired: "Doctoral" },
  { title: "School Principal", category: "Education", salaryMin: 80000, salaryMax: 120000, salaryMedian: 98000, growth: "5%", educationRequired: "Master's" },
  { title: "Special Education Teacher", category: "Education", salaryMin: 45000, salaryMax: 65000, salaryMedian: 55000, growth: "4%", educationRequired: "Bachelor's" },
  { title: "School Counselor", category: "Education", salaryMin: 50000, salaryMax: 75000, salaryMedian: 60000, growth: "10%", educationRequired: "Master's" },
  { title: "Instructional Designer", category: "Education", salaryMin: 55000, salaryMax: 90000, salaryMedian: 70000, growth: "11%", educationRequired: "Master's" },
  { title: "Librarian", category: "Education", salaryMin: 45000, salaryMax: 70000, salaryMedian: 57000, growth: "6%", educationRequired: "Master's" },
  { title: "ESL Teacher", category: "Education", salaryMin: 40000, salaryMax: 60000, salaryMedian: 49000, growth: "5%", educationRequired: "Bachelor's" },

  // Engineering
  { title: "Civil Engineer", category: "Engineering", salaryMin: 65000, salaryMax: 110000, salaryMedian: 89000, growth: "7%", educationRequired: "Bachelor's" },
  { title: "Mechanical Engineer", category: "Engineering", salaryMin: 70000, salaryMax: 115000, salaryMedian: 92000, growth: "2%", educationRequired: "Bachelor's" },
  { title: "Electrical Engineer", category: "Engineering", salaryMin: 70000, salaryMax: 120000, salaryMedian: 96000, growth: "3%", educationRequired: "Bachelor's" },
  { title: "Chemical Engineer", category: "Engineering", salaryMin: 75000, salaryMax: 125000, salaryMedian: 105000, growth: "9%", educationRequired: "Bachelor's" },
  { title: "Environmental Engineer", category: "Engineering", salaryMin: 60000, salaryMax: 100000, salaryMedian: 81000, growth: "4%", educationRequired: "Bachelor's" },
  { title: "Aerospace Engineer", category: "Engineering", salaryMin: 80000, salaryMax: 140000, salaryMedian: 116000, growth: "6%", educationRequired: "Bachelor's" },
  { title: "Biomedical Engineer", category: "Engineering", salaryMin: 65000, salaryMax: 110000, salaryMedian: 88000, growth: "5%", educationRequired: "Bachelor's" },
  { title: "Industrial Engineer", category: "Engineering", salaryMin: 65000, salaryMax: 105000, salaryMedian: 87000, growth: "10%", educationRequired: "Bachelor's" },

  // Legal
  { title: "Paralegal", category: "Legal", salaryMin: 40000, salaryMax: 65000, salaryMedian: 52000, growth: "4%", educationRequired: "Associate's" },
  { title: "Attorney", category: "Legal", salaryMin: 70000, salaryMax: 180000, salaryMedian: 127000, growth: "8%", educationRequired: "Doctoral" },
  { title: "Legal Secretary", category: "Legal", salaryMin: 35000, salaryMax: 55000, salaryMedian: 46000, growth: "-10%", educationRequired: "High School" },
  { title: "Compliance Officer", category: "Legal", salaryMin: 55000, salaryMax: 100000, salaryMedian: 75000, growth: "6%", educationRequired: "Bachelor's" },
  { title: "Court Reporter", category: "Legal", salaryMin: 40000, salaryMax: 75000, salaryMedian: 56000, growth: "-3%", educationRequired: "Associate's" },
  { title: "Mediator", category: "Legal", salaryMin: 50000, salaryMax: 95000, salaryMedian: 66000, growth: "4%", educationRequired: "Bachelor's" },

  // Sales & Marketing
  { title: "Sales Manager", category: "Sales & Marketing", salaryMin: 60000, salaryMax: 130000, salaryMedian: 95000, growth: "5%", educationRequired: "Bachelor's" },
  { title: "Marketing Manager", category: "Sales & Marketing", salaryMin: 65000, salaryMax: 130000, salaryMedian: 98000, growth: "10%", educationRequired: "Bachelor's" },
  { title: "Real Estate Agent", category: "Sales & Marketing", salaryMin: 30000, salaryMax: 100000, salaryMedian: 49000, growth: "5%", educationRequired: "High School" },
  { title: "Account Executive", category: "Sales & Marketing", salaryMin: 50000, salaryMax: 100000, salaryMedian: 72000, growth: "5%", educationRequired: "Bachelor's" },
  { title: "Digital Marketing Specialist", category: "Sales & Marketing", salaryMin: 45000, salaryMax: 80000, salaryMedian: 61000, growth: "19%", educationRequired: "Bachelor's" },
  { title: "Public Relations Specialist", category: "Sales & Marketing", salaryMin: 45000, salaryMax: 80000, salaryMedian: 62000, growth: "8%", educationRequired: "Bachelor's" },
  { title: "Market Research Analyst", category: "Sales & Marketing", salaryMin: 50000, salaryMax: 85000, salaryMedian: 68000, growth: "19%", educationRequired: "Bachelor's" },
  { title: "Advertising Manager", category: "Sales & Marketing", salaryMin: 60000, salaryMax: 120000, salaryMedian: 88000, growth: "10%", educationRequired: "Bachelor's" },

  // Skilled Trades
  { title: "Electrician", category: "Skilled Trades", salaryMin: 45000, salaryMax: 80000, salaryMedian: 60000, growth: "7%", educationRequired: "High School" },
  { title: "Plumber", category: "Skilled Trades", salaryMin: 45000, salaryMax: 80000, salaryMedian: 59000, growth: "2%", educationRequired: "High School" },
  { title: "HVAC Technician", category: "Skilled Trades", salaryMin: 40000, salaryMax: 70000, salaryMedian: 52000, growth: "5%", educationRequired: "High School" },
  { title: "Carpenter", category: "Skilled Trades", salaryMin: 40000, salaryMax: 65000, salaryMedian: 51000, growth: "2%", educationRequired: "High School" },
  { title: "Welder", category: "Skilled Trades", salaryMin: 40000, salaryMax: 70000, salaryMedian: 47000, growth: "2%", educationRequired: "High School" },
  { title: "Auto Mechanic", category: "Skilled Trades", salaryMin: 35000, salaryMax: 60000, salaryMedian: 46000, growth: "-1%", educationRequired: "High School" },
  { title: "Construction Manager", category: "Skilled Trades", salaryMin: 65000, salaryMax: 110000, salaryMedian: 98000, growth: "8%", educationRequired: "Bachelor's" },
  { title: "Commercial Pilot", category: "Skilled Trades", salaryMin: 80000, salaryMax: 160000, salaryMedian: 103000, growth: "6%", educationRequired: "Associate's" },

  // Government
  { title: "Police Officer", category: "Government", salaryMin: 45000, salaryMax: 80000, salaryMedian: 65000, growth: "3%", educationRequired: "High School" },
  { title: "Firefighter", category: "Government", salaryMin: 40000, salaryMax: 75000, salaryMedian: 57000, growth: "4%", educationRequired: "High School" },
  { title: "Social Worker", category: "Government", salaryMin: 40000, salaryMax: 65000, salaryMedian: 50000, growth: "7%", educationRequired: "Bachelor's" },
  { title: "Urban Planner", category: "Government", salaryMin: 55000, salaryMax: 90000, salaryMedian: 74000, growth: "4%", educationRequired: "Master's" },
  { title: "Federal Agent", category: "Government", salaryMin: 60000, salaryMax: 110000, salaryMedian: 85000, growth: "3%", educationRequired: "Bachelor's" },
  { title: "Military Officer", category: "Government", salaryMin: 45000, salaryMax: 95000, salaryMedian: 68000, growth: "5%", educationRequired: "Bachelor's" },

  // Management
  { title: "General Manager", category: "Management", salaryMin: 70000, salaryMax: 140000, salaryMedian: 105000, growth: "6%", educationRequired: "Bachelor's" },
  { title: "Operations Manager", category: "Management", salaryMin: 60000, salaryMax: 120000, salaryMedian: 88000, growth: "6%", educationRequired: "Bachelor's" },
  { title: "HR Manager", category: "Management", salaryMin: 65000, salaryMax: 115000, salaryMedian: 90000, growth: "7%", educationRequired: "Bachelor's" },
  { title: "Project Manager", category: "Management", salaryMin: 70000, salaryMax: 130000, salaryMedian: 96000, growth: "7%", educationRequired: "Bachelor's" },
  { title: "Supply Chain Manager", category: "Management", salaryMin: 65000, salaryMax: 115000, salaryMedian: 93000, growth: "6%", educationRequired: "Bachelor's" },
  { title: "Business Analyst", category: "Management", salaryMin: 60000, salaryMax: 105000, salaryMedian: 83000, growth: "11%", educationRequired: "Bachelor's" },
  { title: "Management Consultant", category: "Management", salaryMin: 75000, salaryMax: 155000, salaryMedian: 112000, growth: "11%", educationRequired: "Master's" },
  { title: "Executive Director", category: "Management", salaryMin: 80000, salaryMax: 160000, salaryMedian: 118000, growth: "8%", educationRequired: "Master's" },
];
