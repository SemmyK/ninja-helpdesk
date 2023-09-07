import { notFound } from 'next/navigation'

//instruction for next.js what to do when the page hasn't been build ahead of time for specific id (if the page hasn't been made and stored in cache)
// 1. telling next to show 404 page for that scenario setting up the value for dynamicParams as false without checking if there is data for that id
export const dynamicParams = true
// 2. setting up value of dynamicParams as true (which is default value) will make next.js to try to fetch the data for that id and  create page for that if data exist it will generate and save static page for it in cache for future request

//getting list of all id that can be params so that next can create routes and pages for each of them so that we have them cached
export async function generateStaticParams() {
	//fetching all data
	const res = await fetch('http://localhost:4000/tickets/')
	const tickets = await res.json()

	//returning array of objects that contain possible params
	return tickets.map(ticket => {
		id: ticket.id
	})
}

const getTicket = async id => {
	try {
		const res = await fetch('http://localhost:4000/tickets/' + id, {
			next: {
				revalidate: 60,
			},
		})

		//to be able to fullfill instruction dynamicParams = true we need to check if response was ok if it's not ok call next.js function notFound which will generate and show 404 page then only if there is no data for id
		if (!res.ok) {
			notFound()
		}

		const data = await res.json()
		return data
	} catch (error) {
		console.log(error)
	}
}

async function TicketDetails({ params }) {
	const { id } = params
	let ticket
	try {
		ticket = await getTicket(id)
	} catch (error) {
		console.log(error)
	}

	if (!ticket) {
		notFound()
	}

	return (
		<main>
			<nav>
				<h2>Ticket Details</h2>
			</nav>
			{ticket && (
				<div className='card'>
					<h3>{ticket.title}</h3>
					<small>Created by {ticket.user_email}</small>
					<p>{ticket.body}</p>
					<div className={`pill ${ticket.priority}`}>
						{ticket.priority} priority
					</div>
				</div>
			)}
		</main>
	)
}
export default TicketDetails
