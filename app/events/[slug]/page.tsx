import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({ icon, alt, label} : {icon: string, alt: string, label: string}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={70} height={70}/>
    <p>{label}</p>
  </div>
  
) 

const EventDetailsPage = async ({params} : {params: Promise<{slug: string}>}) => {
  const {slug} = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`)
  const {event : {description, image, overview, date, time, location, mode,agenda, tags, audience}} = await request.json();

  if(!description) return notFound();


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
          </div>

          <aside className="booking">
              <p className="text-lg font-semibold">
                Book event
              </p>
          </aside>
      </div>
    </section>
  )
}

export default EventDetailsPage;
