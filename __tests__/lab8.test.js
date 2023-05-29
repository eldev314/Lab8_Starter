describe('Basic user flow for Website', () => {
  // First, visit the lab 8 website
  beforeAll(async () => {
    await page.goto('https://cse110-f2021.github.io/Lab8_Website');
  });

  // Next, check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });
    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  it('Make sure <product-item> elements are populated', async () => {
    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;
    let data, plainValue;
    // Query select all of the <product-item> elements
    const prodItems = await page.$$('product-item');

    for (let i = 0; i < prodItems.length; i++) {
      data = await prodItems[i].getProperty('data');
      // Convert that property to JSON
      plainValue = await data.jsonValue();
      // Make sure the title, price, and image are populated in the JSON
      if (plainValue.title.length === 0 || plainValue.price.length === 0 || plainValue.image.length === 0) {
        allArePopulated = false;
        break;
      }
    }

    expect(allArePopulated).toBe(true);

  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    const productItem = await page.$('product-item');
    const shadowRoot = await page.evaluateHandle((element) => element.shadowRoot, productItem);

    const button = await shadowRoot.$('button');
    await button.click();

    await page.waitForFunction(
      (button) => button.innerText === 'Remove from Cart',
      {},
      button
    );

    const buttonText = await page.evaluate((button) => button.innerText, button);

    expect(buttonText).toBe('Remove from Cart');
  }, 2500);


  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    const productItems = await page.$$('product-item');

    for (const productItem of productItems) {
      const shadowRoot = await productItem.getProperty('shadowRoot');
      const shadowRootHandle = await shadowRoot.asElement();

      const addToCartButton = await shadowRootHandle.$('.product button');
      const buttonText = await page.evaluate((button) => button.innerText, addToCartButton);

      if (buttonText == 'Add to Cart') {
        await addToCartButton.click();
      }
    }

    const cartCount = await page.$eval('#cart-count', (element) => element.innerText);
    expect(cartCount).toBe('20');
  }, 10000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    await page.reload();
    await page.waitForSelector('product-item');

    const productItems = await page.$$('product-item');

    for (const productItem of productItems) {
      const shadowRoot = await productItem.getProperty('shadowRoot');
      const shadowRootHandle = await shadowRoot.asElement();

      const button = await shadowRootHandle.$('button');
      const buttonText = await page.evaluate((btn) => btn.innerText, button);

      expect(buttonText).toBe('Remove from Cart');
    }

    const cartCountElement = await page.$('#cart-count');
    const cartCountText = await page.evaluate((element) => element.innerText, cartCountElement);
    expect(cartCountText).toBe('20');
  }, 10000);


  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {
    const cart = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('cart'));
    });

    const expectedCart = Array.from({ length: 20 }, (_, index) => index + 1);

    expect(cart).toEqual(expectedCart);
  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    const productItems = await page.$$('product-item');

    for (const productItem of productItems) {
      const shadowRoot = await productItem.getProperty('shadowRoot');
      const shadowRootHandle = await shadowRoot.asElement();
      const removeFromCartButton = await shadowRootHandle.$('.product button');

      const buttonText = await page.evaluate((button) => button.innerText, removeFromCartButton);
      expect(buttonText).toBe('Remove from Cart');

      await removeFromCartButton.click();
    }

    const cartCountAfterRemove = await page.$eval('#cart-count', (element) => element.innerText);
    expect(cartCountAfterRemove).toBe('0');
  }, 10000);


  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    await page.reload();
    await page.waitForSelector('product-item');

    const productItems = await page.$$('product-item');

    for (const productItem of productItems) {
      const shadowRoot = await productItem.getProperty('shadowRoot');
      const shadowRootHandle = await shadowRoot.asElement();
      const addToCartButton = await shadowRootHandle.$('.product button');

      const buttonText = await page.evaluate((button) => button.innerText, addToCartButton);
      expect(buttonText).toBe('Add to Cart');
    }

    const cartCountAfterReload = await page.$eval('#cart-count', (element) => element.innerText);
    expect(cartCountAfterReload).toBe('0');
  }, 10000);


  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    const cartValue = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cartValue).toBe('[]');
  }, 10000);

});