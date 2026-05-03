import { useEffect, useState } from 'react';
import { publicApi } from '../api/publicApi';
import AppleNafasHome from '../features/apple-home/AppleNafasHome';
import '../styles/apple-nafas-home.css';

export default function Home() {
  const [homepageData, setHomepageData] = useState<unknown>(null);

  useEffect(() => {
    let mounted = true;
    publicApi
      .getHomepage()
      .then((response) => {
        if (mounted) setHomepageData(response.data);
      })
      .catch(() => {
        if (mounted) setHomepageData(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return <AppleNafasHome cmsData={homepageData} />;
}
