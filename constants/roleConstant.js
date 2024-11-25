const roleConstant = {
    SYSTEM_ADMIN: 'SYSTEM-ADMIN',
    ORG_ADMIN: 'ORG-ADMIN',
    CLASS_ADMIN: 'CLASS-ADMIN',
    CLASS_CONTRIBUTOR: 'CLASS-CONTRIBUTOR',
    REGISTERED_MEMBER: 'MEMBER'
};

const roleProjection = {
    _id: 1,
    code: 1,
    name: 1,
    description: 1
};

const adminRoles = [roleConstant.SYSTEM_ADMIN, roleConstant.ORG_ADMIN, roleConstant.CLASS_ADMIN];
exports.roleConstant = roleConstant;
exports.adminRoles = adminRoles;
exports.roleProjection = roleProjection;