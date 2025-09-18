#!/usr/bin/env node

const events = [
  {
    title: "Seniorcafé",
    description: "Månedligt seniorcafé for alle over 65 år. Kaffe, kage og gode samtaler i afslappede omgivelser. Alle er velkomne.",
    start_date: "2025-02-15T14:00:00Z",
    end_date: "2025-02-15T16:00:00Z",
    location: "Menighedshuset",
    is_featured_banner: false
  },
  {
    title: "Ungdomsklub",
    description: "Ugentlig ungdomsklub for 13-18 årige. Spil, musik, snacks og gode samtaler. Kom og mød andre unge fra området.",
    start_date: "2025-01-23T19:00:00Z",
    end_date: "2025-01-23T21:00:00Z",
    location: "Ungdomslokalet",
    is_featured_banner: false
  },
  {
    title: "Dåbsgudstjeneste",
    description: "Særlig gudstjeneste med dåb. Velkommen til en festlig dag for dåbsfamilierne og hele menigheden.",
    start_date: "2025-02-02T10:00:00Z",
    end_date: "2025-02-02T11:00:00Z",
    location: "Gislev Kirke",
    is_featured_banner: false
  },
  {
    title: "Madpakkeklub",
    description: "Gratis madpakker til børn i skoleferien. Åben for alle børn - ingen tilmelding nødvendig.",
    start_date: "2025-02-17T12:00:00Z",
    end_date: "2025-02-17T13:00:00Z",
    location: "Menighedshuset",
    is_featured_banner: true
  }
];

const infoEntries = [
  {
    title: "Kirken søger frivillige",
    content: "Vi søger frivillige til forskellige opgaver i kirken. Både store og små bidrag gør en forskel. Kontakt kontoret hvis du har lyst til at hjælpe.",
    type: "general",
    is_featured_banner: false,
    published_at: "2025-01-18T10:00:00Z"
  },
  {
    title: "Vinterlukket i kirketårnet",
    content: "Grundet vedligeholdelsesarbejde er adgangen til kirketårnet lukket indtil videre. Vi beklager ulejligheden.",
    type: "announcement",
    is_featured_banner: false,
    published_at: "2025-01-12T08:00:00Z"
  },
  {
    title: "Støt kirkens sociale arbejde",
    content: "Din donation gør en forskel for de mest sårbare i vores samfund. Læs mere om vores sociale projekter og hvordan du kan hjælpe.",
    type: "general",
    is_featured_banner: true,
    published_at: "2025-01-25T09:00:00Z"
  }
];

async function addData() {
  console.log('Adding events...');
  for (const event of events) {
    try {
      const response = await fetch('http://localhost:3001/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
      const result = await response.json();
      console.log(`✅ Added event: ${event.title}`);
    } catch (error) {
      console.log(`❌ Failed to add event: ${event.title} - ${error.message}`);
    }
  }

  console.log('\nAdding info entries...');
  for (const info of infoEntries) {
    try {
      const response = await fetch('http://localhost:3001/api/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
      });
      const result = await response.json();
      console.log(`✅ Added info: ${info.title}`);
    } catch (error) {
      console.log(`❌ Failed to add info: ${info.title} - ${error.message}`);
    }
  }

  console.log('\n🎉 Sample data addition complete!');
}

addData().catch(console.error);