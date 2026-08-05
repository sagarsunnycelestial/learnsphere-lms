type Role = keyof typeof ROLES
type Permission =(typeof ROLES)[Role][number]

const ROLES = {
  Admin: [
    "view:dashboard",
     "view:profile",
    "create:user",
    "delete:user",
    "view:user",
    "edit:user",
    "deactivate:user",
    "create:course",
    "view:action"
  ],
  Instructor:[
    "view:profile",
    "create:course",
      "view:action"
  ],
  Student:[
    "view:profile",
  ]
} as const

export function hasPermission(
user:{
accessToken:string | null,
  role:Role,
  isAuthenticated:boolean
  },
  permission:Permission
){
  return (ROLES[user.role] as readonly Permission[]).includes(permission)
}