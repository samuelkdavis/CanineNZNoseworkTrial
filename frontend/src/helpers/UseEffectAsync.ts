import { useEffect } from 'react';


export default function useEffectAsync(effect, inputs) {
    useEffect(() => {
        effect();
    }, inputs);
}

/**
 * Usage:
 * useEffectAsync(async () => {
    const items = await fetchSomeItems();
    console.log(items);
}, []);

Update

If you choose this approach, note that it's bad form. I resort to this when I know it's safe, but it's always bad form and haphazard.

Suspense for Data Fetching, which is still experimental, will solve some of the cases.

In other cases, you can model the async results as events so that you can add or remove a listener based on the component life cycle.

Or you can model the async results as an Observable so that you can subscribe and unsubscribe based on the component life cycle.
https://stackoverflow.com/a/54637708/2727536
 */