import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const productValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(120),
    description: vine.string().trim().maxLength(500).optional(),
    price: vine.number().min(0),
    stock: vine.number().withoutDecimals().min(0),
  })
)

productValidator.messagesProvider = new SimpleMessagesProvider(
  {
    'required': 'El campo {{ field }} es obligatorio',
    'string': 'El campo {{ field }} debe ser texto',
    'minLength': 'El campo {{ field }} debe tener al menos {{ min }} caracteres',
    'maxLength': 'El campo {{ field }} debe tener como máximo {{ max }} caracteres',
    'number': 'El campo {{ field }} debe ser un número',
    'min': 'El campo {{ field }} debe ser mayor o igual a {{ min }}',
    'withoutDecimals': 'El campo {{ field }} debe ser un número entero',
  },
  {
    name: 'nombre',
    description: 'descripción',
    price: 'precio',
    stock: 'stock',
  }
)