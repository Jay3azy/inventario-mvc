import app from '@adonisjs/core/services/app'
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  /**
   * Conexión por defecto: SQLite en desarrollo,
   * PostgreSQL en producción (DB_CONNECTION=pg).
   */
  connection: env.get('DB_CONNECTION', 'sqlite'),

  prettyPrintDebugQueries: true,

  connections: {
    /**
     * SQLite: base de datos local para desarrollo.
     */
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: app.tmpPath('db.sqlite3'),
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      schemaGeneration: {
        enabled: true,
        rulesPaths: ['./database/schema_rules.js'],
      },
      debug: app.inDev,
    },

    /**
     * PostgreSQL: base de datos en la nube (Neon) para producción.
     */
    pg: {
      client: 'pg',
      connection: {
        connectionString: env.get('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      debug: app.inDev,
    },
  },
})

export default dbConfig