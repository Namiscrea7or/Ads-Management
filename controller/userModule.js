export function getUserInfoForMap() {
    const user = getUser(); 
    return {
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      dob: user.dob,
      role: user.role,
    };
  }
  