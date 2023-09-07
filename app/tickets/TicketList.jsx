import Link from 'next/link'

const getTickets = async () => {
	try {
		const res = await fetch('http://localhost:4000/tickets', {
			next: {
				revalidate: 30,
			},
		})

		const data = await res.json()
		return data
	} catch (error) {
		console.log(error)
	}
}
async function TicketList() {
	let tickets
	try {
		tickets = await getTickets()
	} catch (error) {
		console.log(error)
	}

	return (
		<>
			{tickets && tickets.length === 0 && (
				<p className='text-center'>There are no open tickets</p>
			)}
			{tickets &&
				tickets.map(ticket => (
					<div key={ticket.id} className='card my-5'>
						<Link href={`/tickets/${ticket.id}`}>
							<h3>{ticket.title}</h3>
							<p>{ticket.body.slice(0, 200)}...</p>
							<div className={`pill ${ticket.priority}`}>
								{ticket.priority} priority
							</div>
						</Link>
					</div>
				))}
		</>
	)
}
export default TicketList
