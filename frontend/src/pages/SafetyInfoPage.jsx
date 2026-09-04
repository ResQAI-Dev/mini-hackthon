function SafetyInfoPage() {
  const safetyCards = [
    {
      type: 'Flood',
      emoji: '🌊',
      tips: [
        'Move to higher ground immediately.',
        'Avoid walking in moving water.',
        'Do not drive through flooded roads.',
        'Turn off utilities if instructed.',
        'Listen to local emergency alerts.',
      ],
    },
    {
      type: 'Landslide',
      emoji: '⛰️',
      tips: [
        'Stay away from slopes and hillsides.',
        'Listen for unusual sounds (cracking trees).',
        'Evacuate if authorities advise.',
        'Watch for sudden changes in water flow.',
        'Avoid river valleys during heavy rain.',
      ],
    },
    {
      type: 'Storm',
      emoji: '🌪️',
      tips: [
        'Stay indoors and away from windows.',
        'Secure loose outdoor objects.',
        'Charge devices and keep a torch ready.',
        'Avoid using electrical appliances.',
        'Follow weather service warnings.',
      ],
    },
  ];

  return (
    <div className="safety-grid">
      {safetyCards.map((card) => (
        <div key={card.type} className="safety-card">
          <div className="safety-card-header">
            <span className="safety-emoji">{card.emoji}</span>
            <h3 className="safety-card-title">{card.type} Safety</h3>
          </div>
          <ul className="safety-tips">
            {card.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default SafetyInfoPage;
