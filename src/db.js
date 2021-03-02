const knex = require('knex')({
    debug: true,
    client: process.env.DB_CLIENT,
    connection: {
        filename: process.env.DB_FILENAME
    }
});

const bookshelf = require('bookshelf')(knex)

const Message = bookshelf.model('Message', {
    tableName: 'messages',
    groups() {
        return this.belongsToMany('Group', 'groups_messages')
    }
})

const Group = bookshelf.model('Group', {
    tableName: 'groups',
    messages() {
        return this.belongsToMany('Message', 'groups_messages')
    }
})

module.exports = {
    Message,
    Group
}
