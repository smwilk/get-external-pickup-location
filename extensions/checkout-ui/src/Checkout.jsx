import React, { useState, useEffect } from 'react';
import {
  useApi,
  useTranslate,
  reactExtension,
  Button,
  ChoiceList,
  Choice,
  BlockStack,
  useApplyShippingAddressChange,
} from '@shopify/ui-extensions-react/checkout';

const deliveryAddress = reactExtension("purchase.checkout.delivery-address.render-before", () => <Extension />);
export { deliveryAddress };

function Extension() {
  console.log('Extension component rendered');
  const translate = useTranslate();
  const { extension } = useApi();
  const applyShippingAddressChange = useApplyShippingAddressChange();

  // State to hold the API data
  const [data, setData] = useState(null);
  // State to hold the selected location
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Send the API request when the component mounts
  useEffect(() => {
    fetch('https://pig-rochester-monitor-cleared.trycloudflare.com/locations')
      .then(response => response.json())
      .then(data => {
        setData(data);
        // Set the selected location to the first location
        setSelectedLocation(data[0]);
      });
  }, []);

  const handleAddressChange = (newLocation) => {
    console.log('ShippingAddressChange object:', {
      type: 'updateShippingAddress',
      address: {
        address1: newLocation.address,
        city: newLocation.city,
        provinceCode: newLocation.provinceCode,
        countryCode: newLocation.countryCode,
      },
    });
    // Update the selected location
    setSelectedLocation(newLocation);
    applyShippingAddressChange?.({
      type: 'updateShippingAddress',
      address: {
        address1: newLocation.address,
        city: newLocation.city,
        provinceCode: newLocation.provinceCode,
        countryCode: newLocation.countryCode,
      },
    });
  };

  return (
    <BlockStack>
      Please choose a pickup location:
      {data && (
        <ChoiceList
          name="location"
          value={JSON.stringify(selectedLocation)}
          onChange={(selectedLocationString) => {
            // @ts-ignore
            const selectedLocation = JSON.parse(selectedLocationString);
            handleAddressChange(selectedLocation);
          }}
        >
          {data.
            // @ts-ignore
            map((location) => {
              console.log('Choice id:', location.address);
              return (
                <Choice key={location.id} id={JSON.stringify(location)}>
                  {location.address}
                </Choice>
              );
            })}
        </ChoiceList>
      )}
    </BlockStack>
  );
}