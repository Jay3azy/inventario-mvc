import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * SessionController maneja la autenticación y la sesión del usuario:
 * muestra el login, valida credenciales y cierra la sesión.
 */
export default class SessionController {
  /**
   * Mostrar la página de login
   */
  async create({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  /**
   * Autenticar credenciales y crear la sesión
   */
  async store({ request, auth, response, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      return response.redirect().toRoute('products.index')
    } catch {
      session.flash('error', 'Correo o contraseña incorrectos')
      session.flashExcept(['password'])
      return response.redirect().back()
    }
  }

  /**
   * Cerrar la sesión del usuario
   */
  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('session.create')
  }
}