// Site content. Everything here comes from the client brief or is a
// clearly marked placeholder. ALL MEDICAL COPY IS DRAFT and must be
// reviewed and approved by the clinic's dentists before publishing.

export const TBC = "To be confirmed with client";
export const RECOVERY_TBC = "To be confirmed by the doctor after assessment";

export const clinic = {
  name: "Mullapudi Dental Clinic",
  short: "Mullapudi Dental",
  // Text logo (no logo file supplied). The line under the logo is to be confirmed;
  // "DENTAL CLINIC" is simply the rest of the clinic's name.
  logoName: "MULLAPUDI",
  logoTag: "DENTAL CLINIC",
  addressLines: ["1st Floor, Veerabhadra Towers,", "Opposite Boys' High School Main Gate, Rashtrapathi Road,", "Tanuku, Andhra Pradesh 534211"],
  addressShort: "Veerabhadra Towers, Opposite Boys' High School Main Gate, Rashtrapathi Road, Tanuku",
  locationLabel: "Tanuku, Rashtrapathi Road",
  phoneDisplay: "9347595030",
  phoneHref: "tel:+919347595030",
  email: "mullapudidentalclinic@gmail.com",
  // Google Maps links live in src/reviews.json (directionsUrl, reviewsUrl)
  directions: "",
  reviewsUrl: "",
  domain: "[domain to be confirmed]",
  hours: {
    weekText: "Mon to Sat 9 am to 8 pm",
    sunText: "Sunday closed",
    week: "9 am to 8 pm",
    sun: "Closed",
  },
};

export const doctors = [
  {
    id: "nithisha",
    name: "Dr. Nithisha Mullapudi",
    degree: "BDS, FGD", // as supplied: confirm the full form and credentials
    role: "Founder",
    specialty: null,
    services: [],
  },
  {
    id: "prudhvi",
    name: "Dr. Prudhvi Kumar",
    degree: "BDS, MDS", // as supplied: verify
    role: null,
    specialty: "Consultant Paedodontist", // as supplied: confirm preferred title
    services: ["Paediatric dentistry"],
  },
  {
    id: "divya",
    name: "Dr. Divya Srujana",
    degree: "BDS, MDS", // as supplied: verify
    role: null,
    specialty: "Consultant Periodontist", // as supplied: confirm preferred title
    services: [],
  },
];

export const services = [
  {
    slug: "dental-implants",
    name: "Dental Implants",
    icon: "implant",
    sub: "Replacement for missing teeth, fixed in the jawbone.",
    summary: "Dental implants are surgically placed in the jawbone to replace missing teeth. Suitability depends on your oral health and a clinical assessment.",
    points: ["Assessment of bone and gum health", "Single or multiple implants", "Crowns, bridges or dentures on implants"],
    problems: [
      { icon: "gap", t: "Missing teeth", d: "One or more gaps where teeth have been lost or removed." },
      { icon: "alert", t: "Loose dentures", d: "Dentures that move when you eat or speak." },
      { icon: "bolt", t: "Difficulty chewing", d: "Trouble biting or chewing some foods because of missing teeth." },
      { icon: "layers", t: "Bone loss in the jaw", d: "The jawbone becoming thinner where a tooth is missing." },
    ],
    why: [
      { t: "Tooth loss", d: "Teeth can be lost to decay, gum disease or injury, leaving a gap that affects chewing and appearance." },
      { t: "Changes after tooth loss", d: "When a tooth root is missing, the bone around it can shrink over time, and nearby teeth may drift into the gap." },
    ],
    causes: ["Untreated tooth decay", "Gum disease", "Injury to the mouth", "Teeth removed in the past"],
    solutions: [
      { t: "Single implant with crown", involves: "Placing one implant in the jaw and fitting a crown once the area has healed.", suits: "A single missing tooth, where the bone and gums are suitable." },
      { t: "Implant-supported bridge or denture", involves: "Attaching a bridge or denture to implants so it is held in place.", suits: "Several missing teeth, depending on assessment." },
      { t: "Bone grafting", involves: TBC + ".", suits: "Some cases where there is not enough bone for an implant. " + TBC + ".", tbc: true },
    ],
    expect: [
      "An examination, and imaging where needed, to check your bone and gums and plan treatment.",
      "Implant placement, then a healing period before the final tooth is fitted (timing to be confirmed by the doctor).",
      "Follow-up visits to check healing and how the new tooth works.",
    ],
    faq: [
      { q: "Can everyone have implants?", a: "Not everyone. It depends on your bone, gum health and general health. The doctor will assess this before suggesting treatment." },
      { q: "What happens during the procedure?", a: "The doctor will explain the steps, the anaesthetic used and the aftercare for your case before treatment begins." },
      { q: "How do I look after an implant?", a: "Regular brushing, cleaning between teeth and check-ups are important. The doctor will give you aftercare advice." },
    ],
  },
  {
    slug: "root-canal-treatment",
    name: "Root Canal Treatment",
    icon: "tooth",
    sub: "Treatment for problems affecting the pulp inside a tooth.",
    summary: "Root canal treatment is used to treat certain conditions affecting the pulp inside a tooth. A dentist can assess the tooth and discuss the options.",
    points: ["Examination and X-ray where needed", "Cleaning and sealing the root canals", "Restoring the tooth afterwards"],
    problems: [
      { icon: "bolt", t: "Lasting toothache", d: "Pain that keeps coming back or wakes you at night." },
      { icon: "thermo", t: "Lingering sensitivity", d: "Pain from hot or cold that stays after you stop eating or drinking." },
      { icon: "alert", t: "Swelling near a tooth", d: "Swelling of the gum or face around a painful tooth." },
      { icon: "drop", t: "Darkening tooth", d: "A tooth that has changed colour." },
    ],
    why: [
      { t: "Deep decay", d: "A cavity that is not treated can reach the pulp, the soft tissue inside the tooth." },
      { t: "Cracks or injury", d: "A crack or a knock to a tooth can affect the pulp, even if the outside looks fine." },
    ],
    causes: ["Untreated cavities", "Cracked or broken teeth", "Injury to the mouth", "Large or repeated fillings"],
    solutions: [
      { t: "Root canal treatment", involves: "Removing the affected pulp under local anaesthetic, cleaning the canals and sealing them.", suits: "Teeth where the pulp is affected and the tooth can be kept, as assessed by the dentist." },
      { t: "Crown after root canal", involves: "Covering the treated tooth with a crown to help protect it.", suits: "Teeth the dentist advises need extra protection." },
      { t: "Other options", involves: "Discussing alternatives, including removal, if the tooth cannot be kept.", suits: "Teeth that cannot be restored." },
    ],
    expect: [
      "An examination, and an X-ray where needed, to check the tooth.",
      "Treatment under local anaesthetic, in one or more visits depending on the tooth.",
      "A follow-up to restore the tooth and check healing.",
    ],
    faq: [
      { q: "How many visits will I need?", a: "It depends on the tooth. The dentist will tell you after the examination." },
      { q: "Will I need a crown?", a: "Some treated teeth are advised a crown. The dentist will explain what suits your tooth." },
      { q: "What should I expect afterwards?", a: "The dentist will explain aftercare and what to look out for. Contact the clinic if you have concerns." },
    ],
  },
  {
    slug: "braces",
    name: "Braces",
    icon: "smile",
    sub: "Orthodontic treatment to straighten teeth.",
    summary: "Braces are orthodontic appliances used to correct the alignment of teeth and, where appropriate, the bite.",
    points: ["Orthodontic assessment", "Fixed braces", "Regular adjustment visits"],
    problems: [
      { icon: "smile", t: "Crooked teeth", d: "Teeth that are out of line or overlap." },
      { icon: "gap", t: "Gaps between teeth", d: "Spaces between teeth." },
      { icon: "layers", t: "Crowded teeth", d: "Not enough space for the teeth to line up." },
      { icon: "face", t: "Bite problems", d: "Upper and lower teeth that do not meet as expected." },
    ],
    why: [
      { t: "How teeth and jaws develop", d: "The size of the jaws and teeth, and the order teeth come through, affect how they line up." },
      { t: "Habits", d: "Habits such as thumb sucking can affect the position of teeth." },
    ],
    causes: ["Jaw and tooth size", "Early loss of milk teeth", "Thumb or finger sucking", "Family traits"],
    solutions: [
      { t: "Fixed braces", involves: "Brackets attached to the teeth and connected with a wire, adjusted over time.", suits: "Many alignment and bite problems, depending on assessment." },
      { t: "Retainers", involves: "A removable or fixed appliance worn after braces to help keep teeth in position.", suits: "Most people after orthodontic treatment, as advised." },
      { t: "Braces options offered at the clinic", involves: TBC + ".", suits: TBC + ".", tbc: true },
    ],
    expect: [
      "An orthodontic assessment, with records such as photos or X-rays where needed.",
      "Fitting the braces and regular visits for adjustment.",
      "Removing the braces and fitting a retainer.",
    ],
    faq: [
      { q: "How long does treatment take?", a: "It varies from person to person. The dentist will give you an estimate after assessment." },
      { q: "Is there an age limit?", a: "Braces can be used for children and adults. Suitability depends on your teeth and gums." },
      { q: "How do I clean my teeth with braces?", a: "The team will show you how to brush and clean around the braces." },
    ],
  },
  {
    slug: "paediatric-dentistry",
    name: "Paediatric Dentistry",
    icon: "heart",
    sub: "Dental care for infants, children and adolescents.",
    summary: "Paediatric dentistry focuses on oral health and dental care for infants, children and adolescents.",
    points: ["Check-ups for children", "Treatment for milk teeth", "Advice for parents"],
    problems: [
      { icon: "tooth", t: "Cavities in milk teeth", d: "Brown or black spots, or holes, in a child's teeth." },
      { icon: "bolt", t: "Toothache", d: "A child who complains of pain or avoids chewing on one side." },
      { icon: "smile", t: "Worry about visits", d: "A child who is anxious about the dentist." },
      { icon: "crack", t: "Injured teeth", d: "A chipped or loose tooth after a fall." },
    ],
    why: [
      { t: "Sugar and snacking", d: "Frequent sugary snacks and drinks can lead to cavities in young teeth." },
      { t: "Brushing habits", d: "Young children need help to clean all their teeth well." },
    ],
    causes: ["Frequent sweets and sugary drinks", "Brushing without help", "Bottle at bedtime", "Falls and play injuries"],
    solutions: [
      { t: "Check-up and cleaning", involves: "A gentle examination and cleaning, with brushing advice.", suits: "Children of all ages." },
      { t: "Fillings for milk teeth", involves: "Treating decay so the tooth can stay until it falls out naturally.", suits: "Cavities in milk teeth, as assessed." },
      { t: "Preventive treatments", involves: TBC + ".", suits: TBC + ".", tbc: true },
    ],
    expect: [
      "A relaxed first visit so your child can get used to the clinic.",
      "Treatment explained to you and your child, step by step.",
      "Home-care advice and a reminder for the next check-up.",
    ],
    faq: [
      { q: "When should my child first see a dentist?", a: "Ask the clinic. The dentist can advise on the right time for a first visit." },
      { q: "Do milk teeth need treatment?", a: "Milk teeth help with eating and speech and hold space for adult teeth. The dentist will explain the options." },
      { q: "My child is nervous. What can I do?", a: "Let the team know before the visit so they can plan it with your child in mind." },
    ],
  },
  {
    slug: "oral-surgery",
    name: "Oral Surgery",
    icon: "steth",
    sub: "Procedures involving the mouth and related structures.",
    summary: "Oral surgery covers procedures involving the mouth and related structures. Depending on assessment, this may include wisdom tooth removal and selected bone-grafting procedures.",
    points: ["Wisdom tooth removal", "Surgical tooth removal", "Selected bone-grafting procedures"],
    problems: [
      { icon: "alert", t: "Wisdom tooth problems", d: "Pain or swelling at the back of the jaw." },
      { icon: "crack", t: "Broken teeth", d: "Teeth that are broken below the gum line." },
      { icon: "tooth", t: "Teeth that cannot be kept", d: "Teeth the dentist advises should be removed." },
    ],
    why: [
      { t: "Impacted wisdom teeth", d: "Wisdom teeth may not have enough space to come through fully." },
      { t: "Damage or infection", d: "Some teeth are too damaged or infected to be restored." },
    ],
    causes: ["Lack of space for wisdom teeth", "Deep decay", "Injury", "Gum disease"],
    solutions: [
      { t: "Wisdom tooth removal", involves: "Assessing the tooth, usually with an X-ray, and removing it where advised.", suits: "Wisdom teeth causing problems, as assessed by the dentist." },
      { t: "Surgical tooth removal", involves: "Removing a tooth that cannot be taken out simply.", suits: "Broken or hard-to-reach teeth." },
      { t: "Bone grafting", involves: TBC + ".", suits: "Selected cases, depending on assessment. " + TBC + ".", tbc: true },
    ],
    expect: [
      "An examination and imaging where needed, with the procedure explained before you decide.",
      "The procedure under anaesthetic, as advised by the doctor.",
      "Aftercare advice and a follow-up to check healing.",
    ],
    faq: [
      { q: "Does every wisdom tooth need to be removed?", a: "No. The dentist will check the tooth and explain whether removal is advised." },
      { q: "How long is recovery?", a: "It depends on the procedure. The doctor will advise after assessment." },
      { q: "What should I do after the procedure?", a: "Follow the aftercare instructions from the clinic, and contact the clinic if you have concerns." },
    ],
  },
  {
    slug: "laser-gum-therapy",
    name: "Laser Gum Therapy",
    icon: "sparkle",
    sub: "Laser-assisted care for certain gum conditions.",
    summary: "Laser-assisted techniques may be used to manage certain gum conditions. The approach depends on the diagnosis and the treating dentist's assessment.",
    points: ["Gum assessment", "Laser-assisted gum treatment", "Follow-up care"],
    problems: [
      { icon: "drop", t: "Bleeding gums", d: "Gums that bleed when you brush or floss." },
      { icon: "alert", t: "Swollen gums", d: "Gums that look red or puffy." },
      { icon: "thermo", t: "Receding gums", d: "Gums that have pulled back from the teeth." },
    ],
    why: [
      { t: "Plaque and tartar", d: "Plaque left along the gum line irritates the gums, causing swelling and bleeding." },
      { t: "Gum disease", d: "If inflammation continues, it can affect the tissues that support the teeth." },
    ],
    causes: ["Plaque and tartar build-up", "Irregular cleaning", "Smoking", "Some health conditions"],
    solutions: [
      { t: "Gum assessment", involves: "Checking the gums and the support around the teeth.", suits: "Anyone with gum symptoms." },
      { t: "Laser-assisted gum treatment", involves: "Using a laser as part of gum treatment where the dentist finds it suitable.", suits: "Certain gum conditions, as diagnosed.", tbc: true },
      { t: "Cleaning and home care", involves: "Professional cleaning and advice on brushing and cleaning between teeth.", suits: "Most gum conditions." },
    ],
    expect: [
      "A gum examination to understand the cause of your symptoms.",
      "Treatment explained before it starts, including whether a laser is suitable.",
      "Follow-up visits to check how the gums respond.",
    ],
    faq: [
      { q: "Is laser treatment suitable for everyone?", a: "No. The dentist will recommend an approach that fits your diagnosis." },
      { q: "What does treatment feel like?", a: "This depends on the procedure. The dentist will explain what to expect for your case." },
      { q: "How can I keep my gums healthy?", a: "Regular brushing, cleaning between teeth and check-ups help. The team can show you how." },
    ],
  },
  {
    slug: "invisible-aligners",
    name: "Invisible Aligners",
    icon: "smile",
    sub: "Removable clear aligners for straightening teeth.",
    summary: "Clear aligners are removable orthodontic appliances used to move teeth gradually under professional supervision.",
    points: ["Assessment for aligners", "A series of clear aligners", "Regular progress checks"],
    problems: [
      { icon: "smile", t: "Mildly crooked teeth", d: "Teeth that are slightly out of line." },
      { icon: "gap", t: "Gaps between teeth", d: "Spaces you would like to close." },
      { icon: "layers", t: "Crowding", d: "Teeth that overlap." },
    ],
    why: [
      { t: "How aligners work", d: "Each aligner in a series moves the teeth a small amount, under the dentist's supervision." },
      { t: "Wearing them as advised", d: "Aligners work only when worn for the time the dentist recommends." },
    ],
    causes: ["Jaw and tooth size", "Teeth moving over time", "Habits", "Family traits"],
    solutions: [
      { t: "Clear aligner treatment", involves: "Wearing a series of custom aligners, changed as advised by the dentist.", suits: "Some alignment problems, depending on assessment." },
      { t: "Retainers", involves: "A retainer worn after treatment to help keep teeth in position.", suits: "Most people after aligner treatment, as advised." },
      { t: "Aligner systems offered", involves: TBC + ".", suits: TBC + ".", tbc: true },
    ],
    expect: [
      "An assessment to check whether aligners suit your teeth.",
      "Fitting the first aligners and regular check-ups.",
      "A retainer at the end of treatment.",
    ],
    faq: [
      { q: "Can aligners treat every case?", a: "No. Some cases are better suited to braces. The dentist will advise." },
      { q: "How long do I wear them each day?", a: "The dentist will tell you how long to wear them for your treatment." },
      { q: "Can I eat with aligners in?", a: "Aligners are usually removed to eat. The team will explain how to care for them." },
    ],
  },
  {
    slug: "crowns-bridges-veneers",
    name: "Crowns, Bridges and Veneers",
    icon: "tooth",
    sub: "Restoring and replacing teeth.",
    summary: "Crowns cover and restore individual teeth. Bridges can replace one or more missing teeth. Veneers are placed on the front of selected teeth to change their appearance.",
    points: ["Crowns for damaged teeth", "Bridges for missing teeth", "Veneers for appearance"],
    problems: [
      { icon: "crack", t: "Broken or weak teeth", d: "Teeth that are cracked, heavily filled or worn." },
      { icon: "gap", t: "Missing teeth", d: "A gap where a tooth has been lost." },
      { icon: "drop", t: "Discoloured or uneven teeth", d: "Front teeth whose colour or shape you would like to change." },
    ],
    why: [
      { t: "Damage and wear", d: "Large fillings, cracks or wear can weaken a tooth." },
      { t: "Tooth loss", d: "A missing tooth can affect chewing and appearance." },
    ],
    causes: ["Decay and large fillings", "Injury", "Tooth wear", "Missing teeth"],
    solutions: [
      { t: "Crowns", involves: "Shaping the tooth and fitting a custom-made cover over it.", suits: "Teeth that need restoring, as assessed." },
      { t: "Bridges", involves: "Replacing missing teeth with a restoration supported by nearby teeth.", suits: "Some cases of missing teeth, depending on the nearby teeth." },
      { t: "Veneers", involves: "Fixing thin restorations to the front of selected teeth.", suits: "Selected teeth, depending on assessment." },
    ],
    expect: [
      "An examination to check the teeth and discuss options.",
      "Preparation and measurements, then fitting at a later visit.",
      "A check of the fit and advice on care.",
    ],
    faq: [
      { q: "Which option is right for me?", a: "It depends on your teeth and gums. The dentist will explain the options after an examination." },
      { q: "How many visits are needed?", a: "Usually more than one. The dentist will explain the plan for your case." },
      { q: "How do I care for them?", a: "Brush and clean between your teeth as advised, and keep regular check-ups." },
    ],
  },
  {
    slug: "complete-dentures",
    name: "Complete Dentures",
    icon: "tooth",
    sub: "Removable replacement for all teeth in an arch.",
    summary: "Complete dentures are removable appliances designed to replace all teeth in an upper or lower dental arch.",
    points: ["Examination and measurements", "Custom-made dentures", "Fitting and adjustments"],
    problems: [
      { icon: "gap", t: "All teeth missing", d: "No natural teeth left in the upper or lower jaw." },
      { icon: "alert", t: "Old dentures that do not fit", d: "Dentures that are loose or uncomfortable." },
      { icon: "bolt", t: "Difficulty eating", d: "Trouble chewing without teeth." },
    ],
    why: [
      { t: "Tooth loss", d: "Teeth can be lost over time through decay, gum disease or injury." },
      { t: "Changes in the mouth", d: "The gums and bone change shape over time, which can affect how dentures fit." },
    ],
    causes: ["Gum disease", "Decay", "Injury", "Ageing of existing dentures"],
    solutions: [
      { t: "New complete dentures", involves: "Taking measurements and making a custom set of dentures.", suits: "People with no remaining teeth in an arch." },
      { t: "Denture adjustment", involves: "Adjusting dentures to improve comfort.", suits: "Dentures that rub or feel loose." },
    ],
    expect: [
      "An examination and measurements of your mouth.",
      "Trial fittings, then the final dentures.",
      "Follow-up visits for adjustments.",
    ],
    faq: [
      { q: "How long does it take to get used to dentures?", a: "It varies. The dentist will give you advice on eating and speaking with new dentures." },
      { q: "How do I clean my dentures?", a: "The team will show you how to clean and store them." },
      { q: "What if they feel loose?", a: "Contact the clinic. Dentures may need adjusting over time." },
    ],
  },
  {
    slug: "dental-radiography",
    name: "Dental Radiography",
    icon: "shield",
    sub: "Dental X-rays when clinically needed.",
    summary: "Dental radiography uses X-ray imaging to help the dentist assess teeth and supporting structures when imaging is clinically indicated.",
    points: ["X-rays when clinically needed", "Help with diagnosis and planning", "Results explained to you"],
    problems: [
      { icon: "info", t: "Hidden decay", d: "Decay between teeth or under fillings that is hard to see." },
      { icon: "tooth", t: "Root and bone checks", d: "Checking the roots of teeth and the bone around them." },
      { icon: "alert", t: "Planning treatment", d: "Information needed before some treatments." },
    ],
    why: [
      { t: "What the eye cannot see", d: "Some problems are inside or between teeth, or below the gums." },
      { t: "Planning", d: "Some treatments need images to plan safely." },
    ],
    causes: ["Toothache with no clear cause", "Planning implants or root canals", "Checking wisdom teeth", "Monitoring healing"],
    solutions: [
      { t: "Dental X-rays", involves: "Taking X-ray images when the dentist decides they are needed.", suits: "Patients where imaging is clinically indicated." },
      { t: "Imaging types available", involves: TBC + ".", suits: TBC + ".", tbc: true },
    ],
    expect: [
      "The dentist explains why an X-ray is needed.",
      "The image is taken with the appropriate precautions.",
      "The dentist explains what the image shows.",
    ],
    faq: [
      { q: "Are dental X-rays always needed?", a: "No. X-rays are taken only when the dentist decides they are clinically needed." },
      { q: "Should I tell the dentist if I am pregnant?", a: "Yes. Always tell the dentist if you are or may be pregnant." },
      { q: "Can I see my X-ray?", a: "Ask the dentist to explain your images." },
    ],
  },
  {
    slug: "cosmetic-dentistry",
    name: "Cosmetic Dentistry",
    icon: "sparkle",
    sub: "Changing the appearance of teeth and smiles.",
    summary: "Cosmetic dentistry includes procedures intended to change the appearance of teeth and smiles. Suitable options depend on your oral health and a clinical assessment.",
    points: ["Smile assessment", "Options for colour and shape", "Plans explained before treatment"],
    problems: [
      { icon: "drop", t: "Discoloured teeth", d: "Staining that brushing does not remove." },
      { icon: "crack", t: "Chipped teeth", d: "Small chips or rough edges." },
      { icon: "gap", t: "Small gaps", d: "Spaces between front teeth." },
    ],
    why: [
      { t: "Staining", d: "Food, drink and tobacco can stain teeth over time." },
      { t: "Wear and injury", d: "Teeth can chip or wear down." },
    ],
    causes: ["Tea and coffee", "Tobacco", "Minor injury", "Tooth wear"],
    solutions: [
      { t: "Smile assessment", involves: "Checking your teeth and gums and discussing what you would like to change.", suits: "Anyone considering cosmetic treatment." },
      { t: "Veneers", involves: "Thin restorations fixed to the front of selected teeth.", suits: "Selected teeth, depending on assessment." },
      { t: "Other cosmetic options offered", involves: TBC + ".", suits: TBC + ".", tbc: true },
    ],
    expect: [
      "A smile assessment and a discussion of options.",
      "Treatment explained before it starts.",
      "Aftercare advice and a follow-up if needed.",
    ],
    faq: [
      { q: "Is cosmetic treatment right for me?", a: "It depends on your oral health. The dentist will check your teeth and gums first." },
      { q: "How long do results last?", a: "It varies by treatment and habits. The dentist will explain for your case." },
      { q: "Do I need healthy gums first?", a: "Gum and tooth health are usually checked before cosmetic treatment." },
    ],
  },
];
