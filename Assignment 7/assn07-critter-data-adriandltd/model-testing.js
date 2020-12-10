const { Critter, Coordinate } = require('./models');

// attempt to retrieve row (person) with child data (phone numbers)
// FAILS!
/*
Critter.findByPk(1)
.then(critter => {
	console.log("First retrieval ------------------------------------");
	console.log("Retrieved a person by PK: ", JSON.stringify(critter, null, 4));
	// this line prints the promise returned by getPhoneNumbers, not the actual data
	console.log("Tried phone numbers, but got promise: ", JSON.stringify(critter.getPhoneNumbers(), null, 4));
});
*/
// attempt to retrieve row (person) with child data (phone numbers)
// CORRECT!
Critter.findByPk(2)
.then(critter => {
	console.log(JSON.stringify(critter, null, 4));
	// return the promise
	return critter.getCoordinates();
}).then(coords => {
	// and chain to the next .then handler to show the retrieved data
	console.log("->", JSON.stringify(coords, null, 4));
});

// better way to do it! use include clause to indicate that the person results
// should be retrieved with associated data (in this case the phone numbers)
// works for any associated data
Critter.findAll({
	include: [{model: Coordinate}]
})
.then(fuzzies => {
	fuzzies.forEach(person => {
		console.log(JSON.stringify(person, null, 4));
	});
});
/*
// alternative: define an async function and you can block within the function w/ await
// it's okay to block in the function, because the entire function can be run in parallel
// (under the hood it transforms the awaits into promise/then structures)
async function aTest()
{
	// retrieve and wait here (block) for the result
	person = await Person.findOne({
		where : {first_name: "Jane"}});

	console.log("Fifth retrieval (async/await) --------------------------------");
	console.log("A person: ", JSON.stringify(person, null, 4));

	// retrieve and wait here (block) for the result
	pns = await person.getPhoneNumbers();

	console.log("Fifth retrieval continued (numbers) --------------------------------");
	console.log("Waited to get their phone numbers: ", JSON.stringify(pns, null, 4));
}

// call the async function
aTest();

console.log("End of the file");
*/
