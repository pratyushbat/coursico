export interface UserLocationData {
    ip: string;
    city: string;
    region: string;
    country: string;
    loc: string;
    org: string;
    postal: string;
    timezone: string;
}

export interface Address {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isDefault: boolean;
    _id: string;
}

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    profilePic: string;
    email: string;
    role: string;
    userLocationData: UserLocationData;
    addresses: Address[];
}