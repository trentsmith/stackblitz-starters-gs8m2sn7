/*
  # Add test data for food preferences

  1. Test Data
    - Adds sample user preferences for testing
    - Includes various taste profiles and dietary preferences
    - Creates realistic scenarios for testing recommendations
*/

DO $$ 
DECLARE
  test_user_id uuid;
BEGIN
  -- Insert test preferences for a vegetarian user who loves spicy food
  INSERT INTO user_preferences (
    user_id,
    taste_preferences,
    texture_preferences,
    dietary_restrictions,
    preferred_cuisines
  ) VALUES (
    auth.uid(),
    '{
      "sweet": 6,
      "savory": 8,
      "sour": 7,
      "bitter": 4,
      "spicy": 9,
      "salty": 7
    }',
    ARRAY['crunchy', 'crispy'],
    ARRAY['Vegetarian'],
    ARRAY['Indian', 'Thai', 'Mexican']
  );

  -- Insert test preferences for a user who prefers mild, sweet foods
  INSERT INTO user_preferences (
    user_id,
    taste_preferences,
    texture_preferences,
    dietary_restrictions,
    preferred_cuisines
  ) VALUES (
    auth.uid(),
    '{
      "sweet": 9,
      "savory": 6,
      "sour": 4,
      "bitter": 2,
      "spicy": 3,
      "salty": 5
    }',
    ARRAY['creamy', 'tender'],
    ARRAY['Dairy-free'],
    ARRAY['Italian', 'French', 'Mediterranean']
  );

  -- Insert test preferences for a user with multiple dietary restrictions
  INSERT INTO user_preferences (
    user_id,
    taste_preferences,
    texture_preferences,
    dietary_restrictions,
    preferred_cuisines
  ) VALUES (
    auth.uid(),
    '{
      "sweet": 7,
      "savory": 8,
      "sour": 6,
      "bitter": 5,
      "spicy": 7,
      "salty": 6
    }',
    ARRAY['crunchy', 'chewy', 'tender'],
    ARRAY['Gluten-free', 'Dairy-free'],
    ARRAY['Japanese', 'Thai', 'Mediterranean']
  );
END $$;