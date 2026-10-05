import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { productValidator } from '#validators/product'

export default class ProductsController {
  /** Listar productos */
  async index({ view }: HttpContext) {
    const products = await Product.query().orderBy('id', 'desc')
    return view.render('pages/products/index', { products })
  }

  /** Mostrar formulario de creación */
  async create({ view }: HttpContext) {
    return view.render('pages/products/create')
  }

  /** Guardar un producto nuevo */
  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(productValidator)
    await Product.create(payload)
    session.flash('success', 'Producto creado correctamente')
    return response.redirect('/products')
  }

  /** Mostrar formulario de edición */
  async edit({ params, view }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    return view.render('pages/products/edit', { product })
  }

  /** Actualizar un producto */
  async update({ params, request, response, session }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const payload = await request.validateUsing(productValidator)
    await product.merge(payload).save()
    session.flash('success', 'Producto actualizado correctamente')
    return response.redirect('/products')
  }

  /** Eliminar un producto */
  async destroy({ params, response, session }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    session.flash('success', 'Producto eliminado correctamente')
    return response.redirect('/products')
  }
}