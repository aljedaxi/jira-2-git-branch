import {readLines} from "https://deno.land/std/io/bufio.ts"
import {readerFromStreamReader} from "https://deno.land/std/io/streams.ts"

const username = ''
const token = ''
const url = ''
const headers = new Headers ()
headers.set ('Authorization', `Basic ${btoa (`${username}:${token}`)}`)
const response = await fetch (url, {headers})

for await (const l of readLines (readerFromStreamReader (response.body.getReader()))) {
	if (!/XM/.test (l)) continue
	const [ticketName, ticketId] = l.split (',')
	const branchBody = ticketName.replace (/\s+/g, '-').replace (/:/g, '')
	console.log (`git checkout -b ${ticketId}-${branchBody}`)
}
