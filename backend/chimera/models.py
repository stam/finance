from dateutil import parser, tz
from sqlalchemy.types import DateTime, Date, Enum


class Collection():
    def __init__(self, models=[]):
        self.models = models

    def __len__(self):
        return len(self.models)

    def dump(self):
        return [m.dump() for m in self.models]


class Base(object):
    def __init__(self, data={}, currentUser=None):
        self.parse(data, currentUser, 'save')

    def parse(self, data, currentUser=None, reqType=None):
        for col in self.__table__.columns:
            key = col.name

            # If it is a foreign key, we check the input for the key without `_id`
            # EG if we are at col 'project_id' and it is a fk, we check the input for `project`
            if len(col.foreign_keys):
                assert key.endswith('_id')
                # Split the keyname in _, throw away the last part (_id) and join the rest
                key = '_'.join(key.split('_')[:-1])
                if key in data:
                    setattr(self, key + '_id', data[key])
                    continue

            if key in data:
                if type(col.type) == DateTime and data[key] is not None:
                    data[key] = parser.parse(data[key])

                if type(col.type) == Enum and data[key] is not None:
                    data[key] = data[key].value

                setattr(self, key, data[key])

    def __repr__(self):
        return '<Model %r>' % self.id

    def dump(self):
        data = {}
        for col in self.__table__.columns:
            key = col.name
            val = getattr(self, key)

            # Return {'project': id} instead of {'project_id': id}
            if len(col.foreign_keys):
                assert key.endswith('_id')
                key = '_'.join(key.split('_')[:-1])

            if type(col.type) == DateTime and val is not None:
                # Make aware and format as iso
                val = val.replace(tzinfo=tz.tzlocal()).isoformat()

            if type(col.type) == Date and val is not None:
                val = val.isoformat()

            data[key] = val
        return data

    @classmethod
    def find(cls, session, scope):
        query = session.query(cls)

        for col in cls.__table__.columns:
            dbKey = col.name
            scopeKey = dbKey

            # Translate 'project_id' to 'project', a relation key shorthand
            if len(col.foreign_keys):
                assert dbKey.endswith('_id')
                scopeKey = '_'.join(dbKey.split('_')[:-1])

            if dbKey in scope or scopeKey in scope:
                val = scope[scopeKey]
                query = query.filter_by(**{dbKey: val})
                continue

        return Collection(query.all())
