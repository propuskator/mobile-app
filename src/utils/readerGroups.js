import { GROUP_LOGOS_LIST }                 from '../assets/constants/readerGroups';

export function getLogoTypeByPath(logoPath) {
    if (!logoPath) return void 0;
    const logoData = GROUP_LOGOS_LIST?.find(logo => logo?.path === logoPath);

    return logoData?.id;
}
