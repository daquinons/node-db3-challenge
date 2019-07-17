const db = require('../knexfile');

exports.find = () => {
  return db('schemes');
};

exports.findById = id => {
  if (!Number(id)) {
    return null;
  }

  return db('schemes').where('id', id);
};

exports.findSteps = id => {
  return db
    .column('steps.id as id', 'scheme_name', 'step_number', 'instructions')
    .select()
    .from('steps')
    .innerJoin('schemes', 'steps.scheme_id', 'schemes.id')
    .where('schemes.id', id);
};

exports.add = async scheme => {
  const idArray = await db('schemes').insert(scheme);
  return this.findById(idArray[0]);
};

exports.update = async (changes, id) => {
  const numberOfUpdatedElements = await db('schemes')
    .where({ id })
    .update(changes);
  return this.findById(id);
};

exports.remove = async id => {
  const element = await this.findById(id);
  const deletedElements = await db('schemes')
    .where({ id })
    .del();
  return element;
};

exports.addStep = async (step, scheme_id) => {
  const idArray = await db('steps').insert({ ...step, scheme_id });
  const steps = await this.findSteps(scheme_id);
  return steps;
};
