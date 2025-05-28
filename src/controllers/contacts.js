import mongoose from 'mongoose';
import Joi from 'joi';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  updateStatusContact,
  removeContact,
} from '../services/contacts.js';

// Валідаційні схеми
const addContactSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(5).max(20).required(),
  favorite: Joi.boolean().optional(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().min(5).max(20).optional(),
  favorite: Joi.boolean().optional(),
}).min(1);

const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

export const getAllContactsController = async (req, res) => {
  const { _id: owner } = req.user;

  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  const { contacts, total } = await getAllContacts(owner, {
    page,
    limit: perPage,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const totalPages = Math.ceil(total / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  res.status(200).json({
    status: 200,
    message: 'Contacts fetched successfully',
    data: contacts,
    page,
    perPage,
    totalItems: total,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid contact ID format',
    });
  }

  const contact = await getContactById(id, owner);

  if (!contact) {
    return res.status(404).json({
      status: 404,
      message: 'Contact not found',
    });
  }

  res.status(200).json({
    status: 200,
    message: 'Contact fetched successfully',
    data: contact,
  });
};

export const addContactController = async (req, res) => {
  // Валідація тіла запиту
  const { error } = addContactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: `Validation error: ${error.details[0].message}`,
    });
  }

  const { _id: owner } = req.user;
  const contact = await createContact({ ...req.body, userId: owner });

  res.status(201).json({
    status: 201,
    message: 'Contact added successfully',
    data: contact,
  });
};

export const removeContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid contact ID format',
    });
  }

  const deletedContact = await removeContact(id, owner);

  if (!deletedContact) {
    return res.status(404).json({
      status: 404,
      message: 'Contact not found',
    });
  }

  res.status(200).json({
    status: 200,
    message: 'Contact deleted successfully',
    data: null,
  });
};

export const updateContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid contact ID format',
    });
  }

  // Валідація тіла запиту
  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: `Validation error: ${error.details[0].message}`,
    });
  }

  const updatedContact = await updateContact(id, owner, req.body);

  if (!updatedContact) {
    return res.status(404).json({
      status: 404,
      message: 'Contact not found',
    });
  }

  res.status(200).json({
    status: 200,
    message: 'Contact updated successfully',
    data: updatedContact,
  });
};

export const updateStatusContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid contact ID format',
    });
  }

  // Валідація тіла запиту
  const { error } = updateStatusSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: `Validation error: ${error.details[0].message}`,
    });
  }

  const updatedContact = await updateStatusContact(id, owner, req.body.favorite);

  if (!updatedContact) {
    return res.status(404).json({
      status: 404,
      message: 'Contact not found',
    });
  }

  res.status(200).json({
    status: 200,
    message: 'Contact status updated successfully',
    data: updatedContact,
  });
};
