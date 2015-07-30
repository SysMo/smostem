'''
Created on Jul 29, 2015

@author: Atanas Pavlov
@copyright: SysMo Ltd.
'''

from collections import namedtuple
from functools import partial
from flask_login import current_user
from flask_principal import Permission, RoleNeed, UserNeed
from pystem.Exceptions import LoginRequiredError, UnauthorizedError
from pystem.flask import db
import mongoengine.fields as F

ModelNeed = namedtuple('ModelNeed', ['method', 'value'])
EditModelNeed = partial(ModelNeed, 'edit')

class ModelPublicAccess(db.EmbeddedDocument):
	list = F.BooleanField(default = False)
	view = F.BooleanField(default = False)
	edit = F.BooleanField(default = False)
	copy = F.BooleanField(default = False)
	delete = F.BooleanField(default = False)

class ModelViewPermission(Permission):
	def __init__(self, model):
		super(ModelViewPermission, self).__init__(UserNeed(model.owner.get_id()), RoleNeed('admin'))

class ModelEditPermission(Permission):
	def __init__(self, model):
		super(ModelEditPermission, self).__init__(UserNeed(model.owner.get_id()), RoleNeed('admin'))

class ModelCopyPermission(Permission):
	def __init__(self, model):
		super(ModelCopyPermission, self).__init__(UserNeed(model.owner.get_id()), RoleNeed('admin'))

class ModelDeletePermission(Permission):
	def __init__(self, model):
		super(ModelDeletePermission, self).__init__(UserNeed(model.owner.get_id()), RoleNeed('admin'))


