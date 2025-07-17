// Direct email contacts for healthcare platform sales
const COMPANY_EMAILS = [
  // Healthcare Tech Companies
  { company: "Epic Systems", email: "partnerships@epic.com", contact: "Business Development" },
  { company: "Teladoc Health", email: "bd@teladoc.com", contact: "Partnership Team" },
  { company: "Amwell", email: "partnerships@amwell.com", contact: "Strategic Partnerships" },
  { company: "athenahealth", email: "partnerships@athenahealth.com", contact: "Business Development" },
  { company: "Cerner Corporation", email: "solutions@cerner.com", contact: "Solutions Team" },
  { company: "Allscripts", email: "partnerships@allscripts.com", contact: "Partner Relations" },
  
  // Healthcare Networks
  { company: "Kaiser Permanente", email: "innovation@kp.org", contact: "Innovation Team" },
  { company: "Mayo Clinic", email: "ventures@mayo.edu", contact: "Mayo Ventures" },
  { company: "Cleveland Clinic", email: "innovations@ccf.org", contact: "Innovation Office" },
  
  // VCs & Investment
  { company: "Andreessen Horowitz", email: "healthcare@a16z.com", contact: "Healthcare Team" },
  { company: "GV (Google Ventures)", email: "healthcare@gv.com", contact: "Digital Health" },
  { company: "Kleiner Perkins", email: "healthcare@kpcb.com", contact: "Healthcare Partners" },
  
  // Insurance/Payers
  { company: "UnitedHealth", email: "innovation@uhg.com", contact: "Innovation Lab" },
  { company: "Anthem", email: "partnerships@anthem.com", contact: "Strategic Partnerships" },
  { company: "Humana", email: "innovation@humana.com", contact: "Innovation Team" }
];

// Generate ready-to-send email list
function getEmailList() {
  return COMPANY_EMAILS.map(item => ({
    to: item.email,
    subject: `Healthcare Platform Acquisition - ${item.company}`,
    company: item.company,
    contact: item.contact
  }));
}

console.log("📧 DIRECT EMAIL CONTACTS:");
console.log("========================\n");

COMPANY_EMAILS.forEach(item => {
  console.log(`${item.company}`);
  console.log(`📧 ${item.email}`);
  console.log(`👤 ${item.contact}\n`);
});

module.exports = { COMPANY_EMAILS, getEmailList };