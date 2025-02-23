from marshmallow import Schema, fields, ValidationError, validates_schema


class SignupSchema(Schema):
    name = fields.Str(required=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)
    confirm_password = fields.Str(required=True, load_only=True)

    @validates_schema
    def validate_passwords(self, data, **kwargs):
        if data["password"] != data["confirm_password"]:
            raise ValidationError("Passwords must match.")


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    email = fields.Email()
    name = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
