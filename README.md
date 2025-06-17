# 🏥 HIS - Sistema Hospitalario Integrador

**HIS** (Hospital Information System) es una aplicación web diseñada para gestionar el área de internaciones de un hospital. Permite administrar usuarios, habitaciones, camas, pacientes e internaciones, ofreciendo un panel dinámico y accesible para distintos perfiles del sistema (administradores, recepción, enfermería y medicos).

---

## 🚀 Tecnologías utilizadas

- **Node.js** + **Express** - Backend con arquitectura modular
- **Sequelize** - ORM para base de datos MySQL/MariaDB
- **MySQL / MariaDB** - Base de datos relacional
- **Pug** - Motor de plantillas para vistas
- **TailwindCSS** - Estilos responsivos y modernos
- **JavaScript** - Scripts dinámicos para la UI

---


## Cómo ejecutar el proyecto

1. Clona este repositorio:
   ```bash
   git clone https://github.com/LeandroCeli/His_tp_Integrador.git
   ```
2. Ingresa al directorio del proyecto:
   ```bash
   cd biblioteca-app
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Configura la base de datos nombre his_db(local) creada las tablas se sincronozan solas 
5. Sincroniza la base de datos y carga datos de ejemplo (opcional):
   ```bash
   nmp sun seed
   ```
6. Inicia la aplicación:
   ```bash
   npm run start
   ```
7. Accede a la app en tu navegador en :  histpintegrador-production.up.railway.app
8. Para acceder a la admision se hacer ingesando los siguientes valores:
     Email: admision@his.com    
     Contraseña : admision123
 Es una autenticacion provisoria y local al proyecto.



## Entidades principales (tablas)
## Pacientes
id_paciente
dni
nombre
apellido
genero
fecha_nacimiento
telefono
telefono_emergencia
domicilio
grupo_sanguineo
## Internaciones
id_internacion
id_paciente (FK a Pacientes)
id_cama (FK a Camas)
fecha_ingreso
medico_solicitante
id_ingreso (FK a TiposIngreso)
descripcion
## Camas
id_cama
id_habitacion (FK a Habitaciones)
estado
higiene
genero_ocupante
## Habitaciones
id_habitacion
numero_habitacion
id_area (FK a Áreas)
## Áreas
id_area
nombre_area
Mutuales
id_mutual
nombre
## PacienteMutual
id
id_paciente (FK a Pacientes)
id_mutual (FK a Mutuales)
numero_afiliado
## TiposIngreso
id_ingreso
codigo
descripcion