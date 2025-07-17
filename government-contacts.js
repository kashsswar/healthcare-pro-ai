// Government contacts for healthcare platform sales
const GOVERNMENT_CONTACTS = [
  // Central Government - India
  { 
    department: "Ministry of Health & Family Welfare", 
    email: "webmaster.mohfw@gov.in",
    contact: "Digital Health Mission",
    focus: "National Digital Health Mission"
  },
  { 
    department: "NITI Aayog", 
    email: "ceo@niti.gov.in",
    contact: "Health Vertical",
    focus: "Healthcare Innovation"
  },
  { 
    department: "National Health Authority", 
    email: "grievance@nha.gov.in",
    contact: "Ayushman Bharat Team",
    focus: "Digital Health Infrastructure"
  },
  { 
    department: "Ministry of Electronics & IT", 
    email: "secretary@meity.gov.in",
    contact: "Digital India Initiative",
    focus: "Healthcare Digitization"
  },

  // State Governments
  { 
    department: "Delhi Health Department", 
    email: "secy-health@delhi.gov.in",
    contact: "Health Secretary",
    focus: "Delhi Healthcare System"
  },
  { 
    department: "Maharashtra Health Department", 
    email: "health.mah@gov.in",
    contact: "Principal Secretary Health",
    focus: "State Healthcare Digitization"
  },
  { 
    department: "Karnataka Health Department", 
    email: "secy-health@karnataka.gov.in",
    contact: "Health Secretary",
    focus: "Bangalore Healthcare Hub"
  },
  { 
    department: "Tamil Nadu Health Department", 
    email: "secy-health@tn.gov.in",
    contact: "Health Secretary",
    focus: "TN Healthcare Innovation"
  },
  { 
    department: "Gujarat Health Department", 
    email: "secy-health@gujarat.gov.in",
    contact: "Principal Secretary",
    focus: "Digital Gujarat Health"
  },
  { 
    department: "Uttar Pradesh Health Department", 
    email: "secy-health@up.gov.in",
    contact: "Health Secretary",
    focus: "UP Healthcare Modernization"
  },
  { 
    department: "West Bengal Health Department", 
    email: "secy-health@wb.gov.in",
    contact: "Health Secretary",
    focus: "Bengal Healthcare System"
  },
  { 
    department: "Rajasthan Health Department", 
    email: "secy-health@rajasthan.gov.in",
    contact: "Principal Secretary",
    focus: "Rajasthan Digital Health"
  }
];

console.log("🏛️ GOVERNMENT CONTACTS:");
console.log("======================\n");

GOVERNMENT_CONTACTS.forEach(item => {
  console.log(`${item.department}`);
  console.log(`📧 ${item.email}`);
  console.log(`👤 ${item.contact}`);
  console.log(`🎯 ${item.focus}\n`);
});

module.exports = { GOVERNMENT_CONTACTS };