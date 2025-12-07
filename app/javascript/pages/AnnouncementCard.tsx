import { faScroll } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "./Announcements/dates";
import ItemCard from "./shared/ItemCard";

export default function AnnouncementCard({
  announcement
}: any) {
  return (
    <ItemCard href={`/announcements/${announcement.id}`}>
      <ItemCard.Image src={announcement.image_url} fallbackIcon={faScroll} />
      <ItemCard.Content>
        <ItemCard.Title>
          {announcement.title}
        </ItemCard.Title>
        <ItemCard.Description>
          {announcement.text_preview}
        </ItemCard.Description>
        <ItemCard.Actions>
          <ItemCard.Meta>
            {announcement.published_at && formatDate(announcement.published_at)}
          </ItemCard.Meta>
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Lire la suite
          </button>
        </ItemCard.Actions>
      </ItemCard.Content>
    </ItemCard>
  );
}
