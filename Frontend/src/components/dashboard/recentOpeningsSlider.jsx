import RecentOpeningCard from "./recentOpeningCard";

export default function RecentOpeningsSlider({
  openings,
  to = "/student/openings"
}) {
  const cards = Array.from(
    { length: Math.max(openings.length, 6) },
    (_, index) => openings[index % openings.length]
  );
  const duration = `${Math.max(cards.length * 5, 24)}s`;

  const renderGroup = (duplicate = false) => (
    <div
      className="recent-openings-group"
      aria-hidden={duplicate ? "true" : undefined}
    >
      {cards.map((opening, index) => (
        <div
          className="recent-opening-slide"
          key={`${duplicate ? "duplicate" : "original"}-${opening.id}-${index}`}
        >
          <RecentOpeningCard
            opening={opening}
            to={to}
            state={{ openingId: opening.id }}
            duplicate={duplicate}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="recent-openings-marquee">
      <div
        className="recent-openings-track"
        style={{ "--recent-openings-duration": duration }}
      >
        {renderGroup()}
        {renderGroup(true)}
      </div>
    </div>
  );
}
