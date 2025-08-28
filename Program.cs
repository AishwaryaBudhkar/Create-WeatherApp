using System;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Enter the first number:");
        double firstNumber = Convert.ToDouble(Console.ReadLine());
        
        Console.WriteLine("Enter the second number:");
        double secondNumber = Convert.ToDouble(Console.ReadLine());
        
        double sum = firstNumber + secondNumber;
        
        Console.WriteLine($"The sum of {firstNumber} and {secondNumber} is: {sum}");
        
        Console.WriteLine("Press any key to exit...");
        Console.ReadKey();
    }
}