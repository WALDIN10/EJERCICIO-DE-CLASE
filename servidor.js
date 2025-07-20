const http = require('http');
const querystring = require('querystring');
const mysql = require('mysql');

const conexion = mysql.createConnection({
  host: 'localhost',
  port: 3307,
  user: 'waldin',
  password: '123456',
  database: 'formulario_db'
});
conexion.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});
const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const datos = querystring.parse(body);
    console.log("\n=== NUEVA SOLICITUD ===");
    console.log("Método:", req.method);
    console.log("Ruta:", req.url);
    console.log("Datos recibidos:", datos);
    if (req.url === '/formulario') {
      switch (req.method) {
        case 'POST':
          const sql = 'INSERT INTO mensajes (nombre, email, mensaje) VALUES (?, ?, ?)';
          conexion.query(sql, [datos.nombre, datos.email, datos.mensaje], (err, result) => {
            if (err) {
              console.error('Error al insertar en MySQL:', err);
              res.writeHead(500);
              res.end('Error al guardar en la base de datos');
            } else {
              console.log('Datos guardados correctamente en MySQL');
              res.writeHead(201);
              res.end('Datos insertados en la base de datos');
            }
          });
          break;
        case 'PUT':
          res.writeHead(200);
          res.end('Datos actualizados (simulado)');
          break;
        case 'PATCH':
          res.writeHead(200);
          res.end('Datos modificados parcialmente (simulado)');
          break;
        case 'DELETE':
          res.writeHead(200);
          res.end('Datos eliminados (simulado)');
          break;
        default:
          res.writeHead(405);
          res.end('Método HTTP no permitido');
      }
    } else {
      res.writeHead(404);
      res.end('Ruta no encontrada');
    }
  });
});
server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
