import Storage  from '../AsyncStorage';

export async  function getUserAgreement() {
    const isUserAgreed = await Storage.getItem('isAgreed') || '';

    return isUserAgreed;
}

export async  function setUserAgreement({ isAgreed }) {
    await Storage.setItem('isAgreed', isAgreed);
}
