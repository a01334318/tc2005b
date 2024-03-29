const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class User {

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(newUser) {
        this.username = newUser.username || 'John Doe';
        this.password = newUser.password || '1234';
    }

    //Este método servirá para guardar de manera persistente el nuevo objeto. 
    save() {
        return bcrypt.hash(this.password, 12)
        .then((encryptedPassword) => {
            this.password = encryptedPassword;
            return db.execute(`
                INSERT INTO users (username, password)
                VALUES (?, ?)
            `, [this.username, encryptedPassword]);
        })
        .catch((error) => { console.log(error) });
    }

    static fetchOne(username) {
        return db.execute(`
            SELECT * 
            FROM users
            WHERE username = ?
        `, [username]);
    }

    static getPrivileges(username) {
        return db.execute(`
            SELECT p.name
            FROM privileges p, role_privilege rp, roles r, user_role ur, users u
            WHERE u.username = ? AND u.id = ur.idUser AND ur.idRole = r.id 
                AND rp.idRole = r.id AND rp.idPrivilege = p.id
        `, [username]);
    }

}