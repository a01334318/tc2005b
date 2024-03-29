const db = require('../util/database');

/*const contacts = [
{
    name: 'Erik',
    enrollment_id: 'a01334318',
}
];
*/

module.exports = class Contact {
    constructor(newContact) {
        this.name = newContact.name || 'Anonymous';
        this.enrollment_id = newContact.enrollment_id || 'a'
        this.imagen = newContact.imagen || 'default.png';
    }

    //Este método servirá para guardar de manera persistente el nuevo objeto. 
    save() {
        return db.execute(
            `INSERT INTO contacts(name, enrollment_id, imagen)
            VALUES(?, ?, ?)`,
            [this.name, this.enrollment_id, this.imagen]
        );   
    }
    
    //Este método servirá para devolver los objetos del almacenamiento persistente.
    static fetch(id) {
        let query = `SELECT * FROM contacts`;
        if (id != 0) {
            query += ' WHERE enrollment_id = ?'
            return db.execute(query, [id]);
        }
    return db.execute(query);
    }

    static find(valor_busqueda) {
        return db.execute(`
            SELECT * 
            FROM contacts
            WHERE name LIKE ? OR enrollment_id LIKE ? OR imagen LIKE ?
            `, 
            [
                '%' + valor_busqueda + '%', '%' + valor_busqueda + '%', 
                '%' + valor_busqueda + '%'
            ]
        );
    }
}

