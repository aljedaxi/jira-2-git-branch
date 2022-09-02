import {readLines} from "https://deno.land/std/io/bufio.ts"
import {readerFromStreamReader} from "https://deno.land/std/io/streams.ts"

const username = 'jacob@xmentium.com'
const token = 'CtzALBTClM4LZUyuHk6vCF48'
const url = 'https://xmentium.atlassian.net/sr/jira.issueviews:searchrequest-csv-all-fields/10004/SearchRequest-10004.csv?atl_token=9a607669-555b-4671-b5c7-452edf2c56f8_1c921f9068183a5758305ce82125f02c567ad272_lin&tempMax=1000'
const headers = new Headers ()
headers.set ('Authorization', `Basic ${btoa (`${username}:${token}`)}`)
const response = await fetch (url, {headers})

const isValid = s => /XM/.test (s)

const getTicketData = l => l.startsWith('"')
	? [l.split (',').slice (0, 2).join (',').replace (/"|,/g, ''), l.split(',')[2]]
	: l.split (',')

for await (const l of readLines (readerFromStreamReader (response.body.getReader()))) {
	if (!isValid (l)) continue
	const [ticketName, ticketId] = getTicketData (l)
	const branchBody = ticketName.replace (/\s+/g, '-').replace (/:/g, '')
	console.log (`git checkout -b ${ticketId}-${branchBody}`)
}
