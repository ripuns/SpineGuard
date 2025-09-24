#include <Wire.h>     // I2C Communication
#include <MPU6050.h>  // MPU6050 library

MPU6050 mpu;           // Create MPU6050 object
unsigned long t0 = 0;  // Start time
unsigned long lastBuzzTime = 0;
const unsigned long buzzCooldown = 5000;
const int BUZZ_PIN = 8;  // Buzzer pin

void setup() {
  Serial.begin(115200);  // Start serial communication
  Wire.begin();          // Start I2C
  if (!mpu.testConnection()) {
    Serial.println("MPU6050 connection failed!");
  } else {
    Serial.println("MPU6050 connected.");
  }                                        // Initialize MPU6050
  t0 = millis();                           // Get start time
  pinMode(BUZZ_PIN, OUTPUT);               // Set buzzer pin as output
  Serial.println("ts,ax,ay,az,gx,gy,gz");  // CSV header
}

void loop() {
  // Variables for raw sensor data
  int16_t ax, ay, az, gx, gy, gz;
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  Serial.print("Raw AX: ");
  Serial.print(ax);
  Serial.print(" AY: ");
  Serial.print(ay);
  Serial.print(" AZ: ");
  Serial.println(az);


  // Convert to proper units
  float fax = ax / 16384.0;
  float fay = ay / 16384.0;
  float faz = az / 16384.0;
  float fgx = gx / 131.0;
  float fgy = gy / 131.0;
  float fgz = gz / 131.0;

  unsigned long ts = millis() - t0;  // Time since start

  // Print CSV
  Serial.print(ts);
  Serial.print(",");
  Serial.print(fax, 6);
  Serial.print(",");
  Serial.print(fay, 6);
  Serial.print(",");
  Serial.print(faz, 6);
  Serial.print(",");
  Serial.print(fgx, 6);
  Serial.print(",");
  Serial.print(fgy, 6);
  Serial.print(",");
  Serial.println(fgz, 6);

  // Posture alert logic
  unsigned long now = millis();
  if (now - lastBuzzTime >= buzzCooldown) {
    if (fax < -0.3) {
      buzzSlouch();
      lastBuzzTime = now;
    } else if (fax > 0.3) {
      buzzLeanBack();
      lastBuzzTime = now;
    } else if (fay < -0.3) {
      buzzLeanLeft();
      lastBuzzTime = now;
    } else if (fay > 0.3) {
      buzzLeanRight();
      lastBuzzTime = now;
    }
  }

  delay(100);  // 10 Hz sampling rate
}

// === Buzz Patterns ===

void buzzSlouch() {
  digitalWrite(BUZZ_PIN, HIGH);
  delay(150);
  digitalWrite(BUZZ_PIN, LOW);
}

void buzzLeanLeft() {
  for (int i = 0; i < 2; i++) {
    digitalWrite(BUZZ_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZ_PIN, LOW);
    delay(100);
  }
}

void buzzLeanBack() {
  for (int i = 0; i < 3; i++) {
    digitalWrite(BUZZ_PIN, HIGH);
    delay(50);
    digitalWrite(BUZZ_PIN, LOW);
    delay(50);
  }
}

void buzzLeanRight() {
  digitalWrite(BUZZ_PIN, HIGH);
  delay(300);
  digitalWrite(BUZZ_PIN, LOW);
  delay(100);
  digitalWrite(BUZZ_PIN, HIGH);
  delay(300);
  digitalWrite(BUZZ_PIN, LOW);
}
