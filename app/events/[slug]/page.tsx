import BookEvent from "@/components/BookEvent";
import { getSimilarEventsBySlug } from "@/lib/actions/event.action";
import Image from "next/image";
import { IEvent } from "@/database";
import { notFound } from "next/navigation";
import EventCard from "@/components/EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({ icon, alt, label} : {icon: string, alt: string, label: string}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={20} height={20}/>
    <p>{label}</p>
  </div>
  
) 
const EventTags = ({tags} : {tags: string[]}) => (
  <div className="flex flex-row flex-wrap gap-1.5">
      {tags.map((tag) => (
        <div className="pill" key={tag}>
            {tag}
        </div>
      ))}
  </div>
)

const EventAgenda = ({agendaItems} : {agendaItems: string[]}) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
)

const EventDetailsPage = async ({params} : {params: Promise<{slug: string}>}) => {
  const {slug} = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`)
  if (!request.ok) {
    return notFound();
  }
  const {event : {description, image, overview, date, time, location, mode, agenda, tags, audience, organizer}} = await request.json();

  if(!description) return notFound();

  const bookings = 10;

  const similarEvents: IEvent[] = JSON.parse(JSON.stringify(await getSimilarEventsBySlug(slug)));

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>

      <div className="details">

          <div className="content">
              <Image src={image} alt="Event Banner" className="banner" width={800} height={800}/>

              <section className="flex-col-gap-2">
                  <h2>Overview</h2>
                  <p>{overview}</p>
              </section>

              <section className="flex-col-gap-2">
                  <h2>Event Details</h2>
                  <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date}/>
                  <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time}/>
                  <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location}/>
                  <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode}/>
                  <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience}/>
              </section>

              {agenda?.[0] && <EventAgenda agendaItems={agenda}/>}

              <section className="flex-col-gap-2">
                  <h2>About the organizer</h2>
                  <p>{organizer}</p>
              </section>

              {tags?.[0] && <EventTags tags={tags}/>}
          </div>

          <aside className="booking">
                <div className="signup-card">
                    <h2>Book Your Spot</h2>
                    {bookings> 0 ? (
                      <p className="text-sm">
                        Join {bookings} people who have already book their spot! 
                      </p>
                    ) : (
                      <p className="text-sm">Be the first to book your spot</p>
                    )}
                    <BookEvent />
                </div>
          </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
          <h2>Similar Events</h2>
          <div className="events">
               {similarEvents.length>0 && similarEvents.map((similarEvent: IEvent) => (
                <EventCard key={similarEvent._id} {...similarEvent}/>
               ))}     
          </div>            
      </div>
    </section>
  )
}

export default EventDetailsPage;
