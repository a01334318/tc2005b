const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const csrf = require('csurf');
const isAuth = require('./util/is-auth');
const multer = require('multer');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(session({
    secret: 'mi string secreto que debe ser un string aleatorio muy largo, no como éste', 
    resave: false, //La sesión no se guardará en cada petición, sino sólo se guardará si algo cambió 
    saveUninitialized: false, //Asegura que no se guarde una sesión para una petición que no lo necesita
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//fileStorage: Es nuestra constante de configuración para manejar el almacenamiento
const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        //'uploads': Es el directorio del servidor donde se subirán los archivos 
        callback(null, 'public/uploads');
    },
    filename: (request, file, callback) => {
        //aquí configuramos el nombre que queremos que tenga el archivo en el servidor, 
        //para que no haya problema si se suben 2 archivos con el mismo nombre concatenamos el timestamp
        callback(null,
            //En Mac 
            new Date().toISOString() 
            //En Windows
            //new Date().getMilliseconds()
            + '-' + file.originalname
            );
    },
});

//En el registro, pasamos la constante de configuración y
//usamos single porque es un sólo archivo el que vamos a subir, 
//pero hay diferentes opciones si se quieren subir varios archivos. 
//'archivo' es el nombre del input tipo file de la forma
app.use(multer({ storage: fileStorage }).single('imagen')); 

// Middleware para proteger las rutas
const csrfProtection = csrf();
app.use(csrfProtection); 

app.use((request, response, next) => {
    next(); // Le permite a la petición avanzar hacia el siguiente middleware
});

const usersRoutes = require('./routes/users.routes');
app.use('/users', usersRoutes);

const myRoutes = require('./routes/lab.routes.js');
app.use('/', myRoutes);
// Para proteger una ruta, se puede usar el middleware isAuth
app.use('/list', isAuth, myRoutes);

app.use((request, response, next) => {
    response.status(404);
    response.send("404 - Page not found");
});

app.listen(3000);