require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

console.log('connection successful')
function searchQuery(searchTerm) {
    knexInstance
        .select('name')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        // .first()
        .then(result => {
            console.log(result)
        })
}
// searchQuery('fish')

function paginateItems(pageNumber) {
    const productsPerPage = 6
    const offset = productsPerPage * (pageNumber - 1)
    knexInstance
        .select('name', 'price')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

// paginateItems(6)

function getItemsAfterDate(daysAgo) {
    knexInstance
        .select('name', 'price')
        .from('shopping_list')
        .where(
            'date_added', 
            '>', 
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .then(result => {
            console.log(result)
        })
}
// getItemsAfterDate(3)

function totalCost() {
    knexInstance
        .select('category')
        .sum('price AS totalPrice')
        .from('shopping_list')
        .groupBy('category')
        .orderBy([
            { column: 'category', order: 'ASC' },
            { column: 'totalPrice', order: 'DESC' },
        ])
        .then(result => {
            console.log(result)
        })
}

totalCost()