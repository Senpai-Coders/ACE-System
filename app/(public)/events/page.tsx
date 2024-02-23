import React from "react";
import db from "@/lib/database";
import Link from "next/link";
import EventCard from "./[id]/_components/event-card";

type Props = {};

const EventsPage = async ({}: Props) => {
    const events = await db.event.findMany({
        where: { deleted: false },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="flex flex-col min-h-screen py-16 lg:py-24 w-full items-center">
            <div className="p-4 grid grid-cols-1 gap-4 md:grid-cols-2 justify-center w-full lg:max-w-9xl">
                {events.length === 0 && <p>There's no event here yet 🐧</p>}
                {events.map((event) => (
                    <EventCard event={event} key={event.id} />
                ))}
            </div>
        </div>
    );
};

export default EventsPage;
